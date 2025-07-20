import type { Tool } from '../types';

export const trimWhitespace: Tool = {
  name: 'TrimWhitespace',
  description: '清除行前行末的多余空白字符',
  dependencies: [],
  parameters: [],
  condition: (context, text, parameters) => {
    // 文本不为空时执行
    return text.length > 0;
  },
  process: (context, text, parameters = {}) => {
    // 清除每行前后的空白字符
    return text
      .split('\n')
      .map(line => line.trim())
      .join('\n');
  }
}; 