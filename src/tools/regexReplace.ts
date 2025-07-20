import type { Tool } from '../types';

export const regexReplace: Tool = {
  name: 'regexReplace',
  description: '使用正则表达式替换文本内容',
  dependencies: [],
  parameters: [
    {
      name: 'replacements',
      description: '替换规则列表，每个规则包含pattern和replacement',
      defaultValue: []
    },
    {
      name: 'flags',
      description: '正则表达式标志（如 g, i, m）',
      defaultValue: 'g'
    }
  ],
  condition: (context, text, parameters) => {
    // 文本不为空且有替换规则时执行
    return text.length > 0 && parameters?.replacements?.length > 0;
  },
  process: (context, text, parameters = {}) => {
    const { replacements = [], flags = 'g' } = parameters;
    
    if (!replacements.length) {
      return text;
    }

    let result = text;
    
    for (const rule of replacements) {
      const [pattern, replacement] = rule;
      
      if (!pattern) {
        continue;
      }

      try {
        const regex = new RegExp(pattern, flags);
        result = result.replace(regex, replacement);
      } catch (error) {
        // 如果正则表达式无效，跳过这个规则
        console.warn('无效的正则表达式:', pattern, error);
      }
    }
    return result;
  }
}; 