import type { Pipeline, Context, PipelineResult } from '../types';
import { getTool } from '../tools';

// 默认流水线配置
const defaultPipelines: Pipeline[] = [
  {
    id: 'basic-cleanup',
    name: '基础清理',
    description: '清除文本中的多余空白字符',
    tools: ['trimWhitespace']
  }
];

// 流水线存储
let pipelines: Pipeline[] = [...defaultPipelines];

// 获取所有流水线
export function getPipelines(): Pipeline[] {
  return pipelines;
}

// 根据ID获取流水线
export function getPipeline(id: string): Pipeline | undefined {
  return pipelines.find(p => p.id === id);
}

// 执行流水线
export function executePipeline(pipelineId: string, inputText: string): PipelineResult {
  const pipeline = getPipeline(pipelineId);
  if (!pipeline) {
    return {
      success: false,
      output: '',
      error: `流水线 ${pipelineId} 不存在`
    };
  }

  const context: Context = {};
  let currentText = inputText;

  try {
    for (const toolName of pipeline.tools) {
      const tool = getTool(toolName);
      if (!tool) {
        return {
          success: false,
          output: '',
          error: `工具 ${toolName} 不存在`
        };
      }

      // 检查处理条件
      if (tool.condition(context, currentText)) {
        // 执行处理
        currentText = tool.process(context, currentText);
      }
    }

    return {
      success: true,
      output: currentText
    };
  } catch (error) {
    return {
      success: false,
      output: '',
      error: `执行流水线时出错: ${error}`
    };
  }
} 