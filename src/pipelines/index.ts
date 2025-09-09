import type { Pipeline, Context, PipelineResult, PipelineTool } from '../types';
import { getTool } from '../tools';
import examplePipeline from './example.json';
import pp1Pipeline from './pp1.json';

// 转换工具配置格式：除了name之外的字段自动成为parameters
function transformToolConfig(toolConfig: any): PipelineTool {
  const { name, ...parameters } = toolConfig;
  return {
    name,
    parameters: Object.keys(parameters).length > 0 ? parameters : undefined
  };
}

// 转换流水线配置格式
function transformPipelineConfig(pipelineConfig: any): Pipeline {
  return {
    ...pipelineConfig,
    tools: pipelineConfig.tools.map(transformToolConfig)
  };
}

// 合并所有流水线配置
const allPipelines = [
  transformPipelineConfig(examplePipeline),
  transformPipelineConfig(pp1Pipeline),
];

// 流水线存储
let pipelines: Pipeline[] = [...allPipelines];

// 获取所有流水线
export function getPipelines(): Pipeline[] {
  return pipelines;
}

// 根据ID获取流水线
export function getPipeline(id: string): Pipeline | undefined {
  return pipelines.find(p => p.id === id);
}

// 执行流水线
export function executePipeline(pipelineId: string, inputText: string, context: Context): PipelineResult {
  const pipeline = getPipeline(pipelineId);
  if (!pipeline) {
    return {
      success: false,
      output: '',
      error: `流水线 ${pipelineId} 不存在`
    };
  }

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
      const defaultParameters = tool.parameters.reduce((acc, param) => {
        if (param.defaultValue !== undefined) {
          acc[param.name] = param.defaultValue;
        }
        return acc;
      }, {} as Record<string, any>);
      const parameters = { ...defaultParameters, ...toolConfig.parameters };
      
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