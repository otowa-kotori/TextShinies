import type { Tool } from '../types';

export const trimWhitespace: Tool = {
  name: 'trimWhitespace',
  description: '清除行前行末的多余空白字符',
  dependencies: [],
  parameters: [],
  condition: (context, text) => {
    // 总是执行，除非文本为空
    return text.length > 0;
  },
  process: (context, text) => {
    // 清除每行前后的空白字符
    return text
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  }
}; 