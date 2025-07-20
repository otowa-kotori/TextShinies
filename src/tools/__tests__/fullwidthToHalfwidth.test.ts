import { describe, it, expect } from 'vitest';
import { fullwidthToHalfwidth } from '../fullwidthToHalfwidth';

describe('FullwidthToHalfwidth', () => {
  const context = {};

  describe('condition', () => {
    it('应该对非空文本返回true', () => {
      expect(fullwidthToHalfwidth.condition(context, 'hello world')).toBe(true);
      expect(fullwidthToHalfwidth.condition(context, 'ａｂｃ')).toBe(true);
    });

    it('应该对空文本返回false', () => {
      expect(fullwidthToHalfwidth.condition(context, '')).toBe(false);
    });
  });

  describe('process', () => {
    it('应该转换全角数字', () => {
      const input = '１２３４５６７８９０';
      const expected = '1234567890';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该转换全角大写字母', () => {
      const input = 'ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ';
      const expected = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该转换全角小写字母', () => {
      const input = 'ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ';
      const expected = 'abcdefghijklmnopqrstuvwxyz';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该转换混合的全角字符', () => {
      const input = 'Ａｐｐｌｅ１２３';
      const expected = 'Apple123';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该转换全角空格', () => {
      const input = 'ａ　ｂ　ｃ';
      const expected = 'a b c';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该转换其他符号', () => {
      const input = '［］｛｝＂＇＃＄％＆＊＋－／＜＝＞＠＼＾＿｀｜～';
      const expected = '[]{}"\'#$%&*+-/<=>@\\^_`|~';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该处理toLowerCase参数', () => {
      const input = 'ＡＢＣＤＥＦ';
      const expected = 'abcdef';
      expect(fullwidthToHalfwidth.process(context, input, { toLowerCase: true })).toBe(expected);
    });

    it('应该处理convertCommonPunctuation参数', () => {
      const input = '你好，世界！这是一个测试？';
      const expected = '你好,世界!这是一个测试?';
      expect(fullwidthToHalfwidth.process(context, input, { convertCommonPunctuation: true })).toBe(expected);
    });

    it('应该同时处理多个参数', () => {
      const input = 'ＡＢＣ，１２３！';
      const expected = 'abc,123!';
      expect(fullwidthToHalfwidth.process(context, input, { 
        toLowerCase: true, 
        convertCommonPunctuation: true 
      })).toBe(expected);
    });

    it('应该保持中文文本不变', () => {
      const input = '你好世界';
      const expected = '你好世界';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该处理空字符串', () => {
      const input = '';
      const expected = '';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });

    it('应该处理没有全角字符的文本', () => {
      const input = 'Hello World 123';
      const expected = 'Hello World 123';
      expect(fullwidthToHalfwidth.process(context, input)).toBe(expected);
    });
  });
}); 