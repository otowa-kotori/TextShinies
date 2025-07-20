// 上下文环境，整个流水线共享
export interface Context {
  [key: string]: any;
}

// 工具参数定义
export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  defaultValue?: any;
}

// 工具定义
export interface Tool {
  name: string;
  description: string;
  dependencies: string[]; // 依赖的工具列表
  parameters: ToolParameter[];
  condition: (context: Context, text: string) => boolean; // 处理条件函数
  process: (context: Context, text: string) => string; // 处理函数
}

// 流水线定义
export interface Pipeline {
  id: string;
  name: string;
  description: string;
  tools: string[]; // 工具名称列表，按执行顺序
}

// 流水线执行结果
export interface PipelineResult {
  success: boolean;
  output: string;
  error?: string;
} 