import { describe, it, expect } from 'vitest';
import { trimWhitespace } from '../trimWhitespace';

describe('TrimWhitespace', () => {
  const context = {};

  describe('condition', () => {
    it('应该对非空文本返回true', () => {
      expect(trimWhitespace.condition(context, 'hello world')).toBe(true);
      expect(trimWhitespace.condition(context, 'a')).toBe(true);
    });

    it('应该对空文本返回false', () => {
      expect(trimWhitespace.condition(context, '')).toBe(false);
    });
  });

  describe('process', () => {
    it('应该清除单行前后的空白字符', () => {
      const input = '  hello world  ';
      const expected = 'hello world';
      expect(trimWhitespace.process(context, input)).toBe(expected);
    });

    it('应该清除多行前后的空白字符', () => {
      const input = '  line1  \n  line2  \n  line3  ';
      const expected = 'line1\nline2\nline3';
      expect(trimWhitespace.process(context, input)).toBe(expected);
    });

    it('应该保留行中间的空白字符', () => {
      const input = '  hello   world  ';
      const expected = 'hello   world';
      expect(trimWhitespace.process(context, input)).toBe(expected);
    });

    it('应该处理只有空白字符的行', () => {
      const input = '  \n  \n  ';
      const expected = '\n\n';
      expect(trimWhitespace.process(context, input)).toBe(expected);
    });

    it('应该处理制表符', () => {
      const input = '\thello world\t';
      const expected = 'hello world';
      expect(trimWhitespace.process(context, input)).toBe(expected);
    });

    it('应该处理混合空白字符', () => {
      const input = ' \t \n hello world \t \n ';
      const expected = '\nhello world\n';
      expect(trimWhitespace.process(context, input)).toBe(expected);
    });
  });
}); 