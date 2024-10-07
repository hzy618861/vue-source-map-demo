<template>
  <div v-if="isError" class="container">
    <pre>
         {{ js_error.stack }}
    </pre>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item
        v-for="(item, index) in js_error.statck_frames"
        :key="index"
        :name="index"
        :title="item.source"
      >
        <el-row :gutter="20">
          <el-col :span="20">
            <div>{{ item.fileName }}</div>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              size="small"
              @click="openDialog(item, index)"
              >映射源码</el-button
            >
          </el-col>
        </el-row>
        <el-row :gutter="20">
             <PreView :origin="item.original" v-if="item.original"/>
             <div v-else>
                {{ item.fileName }}
             </div>
        </el-row>
      </el-collapse-item>
    </el-collapse>
    <el-dialog
      v-model="dialogVisible"
      title="sourceMap源码映射"
      width="80%"
      center
    >
      <el-tabs v-model="tabActiveName" type="card" @tab-click="handleClick">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag :before-upload="sourceMapUpload">
            <i class="el-icon-upload"></i>
            <div>将文件拖到此处，或者<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="request"></el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import sourceMap from 'source-map-js'
import { ElMessage } from "element-plus";
import { onMounted, ref } from "vue";
import PreView from "../components/PreView.vue";
const js_error = ref(null);
const isError = ref(false);
const dialogVisible = ref(false);
const tabActiveName = ref(false);
let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0,
};
onMounted(() => {
  try {
    const jsErrorList = localStorage.getItem("jsErrorList");
    if (jsErrorList) {
      js_error.value = JSON.parse(jsErrorList);
      isError.value = true;
    }
  } catch (e) {
    console.log(e);
  }
});
function openDialog(params, index) {
  dialogVisible.value = true;
  stackFrameObj = {
    line: params.lineNumber,
    column: params.columnNumber,
    index,
  };
}
function sourceMapUpload(file) {
  if (!file.name.endsWith(".map")) {
    ElMessage.error("请上传正确的sourceMap文件");
    return;
  }
  const reader = new FileReader();
  reader.readAsText(file, "utf-8");
  reader.onload = async function (e) {
      const code = await getSource(e.target.result, stackFrameObj.line, stackFrameObj.column);
      js_error.value.statck_frames[stackFrameObj.index].original = code;
      dialogVisible.value = false
  };
  const getSource = async (soureMap, line, column) => {
     try {
      const consumer = await new sourceMap.SourceMapConsumer(JSON.parse(soureMap));
    // 通过报错位置查找对应源文件的名称和行数
      const originalPosition = consumer.originalPositionFor({
        line,
        column,
      });
      const source = consumer.sourceContentFor(originalPosition.source)
      return {
        source,
        column: originalPosition.column,
        line: originalPosition.line,
      }
     }catch(e) {
       ElMessage.error("sourceMap文件解析失败");
     }
  };
}
</script>

<style scoped>
.container {
  margin-top: 30px;
}
</style>
