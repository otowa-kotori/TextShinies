import type { Pipeline, Context, PipelineResult } from '../types';
import { getTool } from '../tools';
import pipelinesConfig from './pipelines.json';

// 流水线存储
let pipelines: Pipeline[] = [...pipelinesConfig];

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
    for (const toolConfig of pipeline.tools) {
      const tool = getTool(toolConfig.name);
      if (!tool) {
        return {
          success: false,
          output: '',
          error: `工具 ${toolConfig.name} 不存在`
        };
      }

      // 合并默认参数和配置参数
      const parameters = { ...toolConfig.parameters };
      
      // 检查处理条件
      if (tool.condition(context, currentText, parameters)) {
        // 执行处理
        currentText = tool.process(context, currentText, parameters);
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