import type { Tool } from '../types';
import { trimWhitespace } from './trimWhitespace';
import { regexReplace } from './regexReplace';
import { fullwidthToHalfwidth } from './fullwidthToHalfwidth';

// 工具注册表
const tools: Map<string, Tool> = new Map();

// 注册工具
export function registerTool(tool: Tool) {
  tools.set(tool.name, tool);
}

// 获取工具
export function getTool(name: string): Tool | undefined {
  return tools.get(name);
}

// 获取所有工具
export function getAllTools(): Tool[] {
  return Array.from(tools.values());
}

// 初始化默认工具
registerTool(trimWhitespace);
registerTool(regexReplace);
registerTool(fullwidthToHalfwidth);
