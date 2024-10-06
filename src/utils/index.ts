import axios from 'axios'
import sourceMap from 'source-map-js'

const getSourceMap = async (url: string) => {
    const res = await axios.get(url)
    return res
}
const findCodeBySourceMap = async (stackFrame: any) => {
    const map = await getSourceMap(stackFrame.fileName + '.map')
    const fileContent = map.data
    // 解析map文件
    const consumer = await new sourceMap.SourceMapConsumer(fileContent)
    // 通过报错位置查找对应源文件的名称和行数
    const originalPosition = consumer.originalPositionFor({
        line: stackFrame.lineNumber,
        column: stackFrame.columnNumber
    })
    const code = consumer.sourceContentFor(originalPosition.source)
    console.log(code, '还原之后的代码')
}

export {
    findCodeBySourceMap
}