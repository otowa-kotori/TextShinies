import type { Tool } from '../types';
import { getDefaultValues } from './utils';

export const fullwidthToHalfwidth: Tool = {
  name: 'FullwidthToHalfwidth',
  description: '将全角字母和数字转换为半角形式',
  dependencies: [],
  parameters: [
    {
      name: 'toLowerCase',
      description: '是否同时将全角大写字母转换为小写',
      defaultValue: false
    },
    {
      name: 'convertCommonPunctuation',
      description: '是否转换常用中文标点符号（逗号、分号、引号、括号、问号、感叹号等）',
      defaultValue: false
    }
  ],
  condition: (context, text, parameters) => {
    // 文本不为空时执行
    return text.length > 0;
  },
  process: (context, text, parameters = {}) => {
    const defaults = getDefaultValues(fullwidthToHalfwidth.parameters);
    const { toLowerCase, convertCommonPunctuation } = { ...defaults, ...parameters };
    
    let result = text;
    
    // 全角数字映射
    const numberMap: Record<string, string> = {
      '０': '0', '１': '1', '２': '2', '３': '3', '４': '4',
      '５': '5', '６': '6', '７': '7', '８': '8', '９': '9'
    };
    
    // 全角大写字母映射
    const upperLetterMap: Record<string, string> = {
      'Ａ': 'A', 'Ｂ': 'B', 'Ｃ': 'C', 'Ｄ': 'D', 'Ｅ': 'E',
      'Ｆ': 'F', 'Ｇ': 'G', 'Ｈ': 'H', 'Ｉ': 'I', 'Ｊ': 'J',
      'Ｋ': 'K', 'Ｌ': 'L', 'Ｍ': 'M', 'Ｎ': 'N', 'Ｏ': 'O',
      'Ｐ': 'P', 'Ｑ': 'Q', 'Ｒ': 'R', 'Ｓ': 'S', 'Ｔ': 'T',
      'Ｕ': 'U', 'Ｖ': 'V', 'Ｗ': 'W', 'Ｘ': 'X', 'Ｙ': 'Y', 'Ｚ': 'Z'
    };
    
    // 全角小写字母映射
    const lowerLetterMap: Record<string, string> = {
      'ａ': 'a', 'ｂ': 'b', 'ｃ': 'c', 'ｄ': 'd', 'ｅ': 'e',
      'ｆ': 'f', 'ｇ': 'g', 'ｈ': 'h', 'ｉ': 'i', 'ｊ': 'j',
      'ｋ': 'k', 'ｌ': 'l', 'ｍ': 'm', 'ｎ': 'n', 'ｏ': 'o',
      'ｐ': 'p', 'ｑ': 'q', 'ｒ': 'r', 'ｓ': 's', 'ｔ': 't',
      'ｕ': 'u', 'ｖ': 'v', 'ｗ': 'w', 'ｘ': 'x', 'ｙ': 'y', 'ｚ': 'z'
    };
    
    // 常用中文标点符号映射
    const commonPunctuationMap: Record<string, string> = {
      '，': ',', '。': '.', '：': ':', '；': ';', '！': '!', '？': '?',
      '（': '(', '）': ')'
    };
    
    // 其他符号映射
    const otherSymbolsMap: Record<string, string> = {
      '［': '[', '］': ']', '｛': '{', '｝': '}',
      '＂': '"', '＇': "'", '　': ' ',  // 全角空格
      '＃': '#', '＄': '$', '％': '%', '＆': '&', '＊': '*',
      '＋': '+', '－': '-', '／': '/', '＜': '<', '＝': '=', '＞': '>',
      '＠': '@', '＼': '\\', '＾': '^', '＿': '_', '｀': '`', '｜': '|',
      '～': '~'
    };
    
    // 执行转换
    for (const [fullwidth, halfwidth] of Object.entries(numberMap)) {
      result = result.replace(new RegExp(fullwidth, 'g'), halfwidth);
    }
    
    for (const [fullwidth, halfwidth] of Object.entries(lowerLetterMap)) {
      result = result.replace(new RegExp(fullwidth, 'g'), halfwidth);
    }
    
    for (const [fullwidth, halfwidth] of Object.entries(upperLetterMap)) {
      const replacement = toLowerCase ? halfwidth.toLowerCase() : halfwidth;
      result = result.replace(new RegExp(fullwidth, 'g'), replacement);
    }
    
    // 根据参数决定是否转换常用标点符号
    if (convertCommonPunctuation) {
      for (const [fullwidth, halfwidth] of Object.entries(commonPunctuationMap)) {
        result = result.replace(new RegExp(fullwidth, 'g'), halfwidth);
      }
    }
    
    // 转换其他符号
    for (const [fullwidth, halfwidth] of Object.entries(otherSymbolsMap)) {
        result = result.replace(new RegExp(fullwidth, 'g'), halfwidth);
    }
    
    return result;
  }
}; 