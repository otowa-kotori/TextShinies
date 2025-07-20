import type { Tool } from '../types';

export const regexReplace: Tool = {
  name: 'regexReplace',
  description: '使用正则表达式替换文本内容',
  dependencies: [],
  parameters: [
    {
      name: 'pattern',
      type: 'string',
      description: '正则表达式模式',
      defaultValue: ''
    },
    {
      name: 'replacement',
      type: 'string',
      description: '替换文本',
      defaultValue: ''
    },
    {
      name: 'flags',
      type: 'string',
      description: '正则表达式标志（如 g, i, m）',
      defaultValue: 'g'
    }
  ],
  condition: (context, text, parameters) => {
    // 文本不为空且有正则模式时执行
    return text.length > 0 && parameters?.pattern;
  },
  process: (context, text, parameters = {}) => {
    const { pattern, replacement = '', flags = 'g' } = parameters;
    
    if (!pattern) {
      return text;
    }

    try {
      const regex = new RegExp(pattern, flags);
      return text.replace(regex, replacement);
    } catch (error) {
      // 如果正则表达式无效，返回原文本
      console.warn('无效的正则表达式:', pattern, error);
      return text;
    }
  }
}; 