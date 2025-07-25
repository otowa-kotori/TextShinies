// 上下文环境，整个流水线共享
export interface Context {
  [key: string]: any;
  measureText?: (text: string) => number;
}

// 工具参数定义
export interface ToolParameter {
  name: string;
  description: string;
  defaultValue?: any;
}

// 工具定义
export interface Tool {
  name: string;
  description: string;
  dependencies: string[]; // 依赖的工具列表
  parameters: ToolParameter[];
  condition: (context: Context, text: string, parameters?: Record<string, any>) => boolean; // 处理条件函数
  process: (context: Context, text: string, parameters?: Record<string, any>) => string; // 处理函数
}

// 流水线中的工具配置
export interface PipelineTool {
  name: string;
  parameters?: Record<string, any>; // 工具参数配置
}

// 流水线定义
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  tools: PipelineTool[]; // 工具配置列表，按执行顺序
}

// 流水线执行结果
export interface PipelineResult {
  success: boolean;
  output: string;
  error?: string;
} 