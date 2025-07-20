import { describe, it, expect } from 'vitest';
import { mergeSplitLines } from '../mergeSplitLines';

describe('MergeSplitLines', () => {
  describe('condition', () => {
    it('应该对非空文本返回true', () => {
      const context = {};
      expect(mergeSplitLines.condition(context, 'hello world')).toBe(true);
      expect(mergeSplitLines.condition(context, 'line1\nline2')).toBe(true);
    });

    it('应该对空文本返回false', () => {
      const context = {};
      expect(mergeSplitLines.condition(context, '')).toBe(false);
    });
  });

  describe('process', () => {
    it('应该合并宽度相似的行', () => {
      const context = {
        measureText: (text: string) => text.length * 10 // 模拟测量函数
      };
      
      const input = 'This is a long line that should be\nsplit into multiple lines for\nbetter readability and\nformatting purposes.';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBeDefined();
      expect(result.length).toBeLessThanOrEqual(input.length);
    });

    it('应该在没有measureText函数时使用字符串长度', () => {
      const context = {};
      
      const input = 'line1\nline2\nline3\nline4';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 10
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBeDefined();
    });

    it('应该处理行数少于最小要求的情况', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = 'line1\nline2';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBe(input); // 应该返回原文本
    });

    it('应该处理所有行都超过最大宽度的情况', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = 'very long line that exceeds the maximum width\nanother very long line\nthird very long line';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 50
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBe(input); // 应该返回原文本
    });

    it('应该处理相似宽度的行数不够的情况', () => {
      const context = {
        measureText: (text: string) => {
          // 只有前两行宽度相似
          if (text.includes('line1') || text.includes('line2')) {
            return 200;
          }
          else if (text.includes('line3') || text.includes('line4')) {
            return 100;
          }
          else {
            return 50;
          }
        }
      };
      
      const input = 'line1\nline2\nline3\nline4\nline5';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBe(input); // 应该返回原文本
    });

    it('应该使用默认参数', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = 'This is a test line\nthat should be merged\nwith other similar lines\nfor better formatting.';
      
      const result = mergeSplitLines.process(context, input);
      expect(result).toBeDefined();
    });

    it('应该处理空字符串', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = '';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBe('');
    });

    it('应该处理单行文本', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = 'single line text';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 3,
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBe(input); // 应该返回原文本
    });

    it('应该处理宽度范围比例参数', () => {
      const context = {
        measureText: (text: string) => {
          // 所有行宽度都在90-110之间
          return 100;
        }
      };
      
      const input = 'line1\nline2\nline3\nline4\nline5';
      const parameters = {
        widthRangeRatio: 0.05, // 5%的范围
        minLineCount: 3,
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBeDefined();
    });

    it('应该处理最大宽度参数', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = 'short\nmedium length\nvery long line that exceeds limit\nshort again';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 2,
        maxWidth: 100 // 只有前两行符合条件
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBeDefined();
    });

    it('应该处理最小行数参数', () => {
      const context = {
        measureText: (text: string) => text.length * 10
      };
      
      const input = 'line1\nline2\nline3\nline4';
      const parameters = {
        widthRangeRatio: 0.1,
        minLineCount: 5, // 需要5行，但只有4行
        maxWidth: 500
      };
      
      const result = mergeSplitLines.process(context, input, parameters);
      expect(result).toBe(input); // 应该返回原文本
    });
  });
}); 