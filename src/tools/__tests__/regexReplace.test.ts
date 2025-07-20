import { describe, it, expect } from 'vitest';
import { regexReplace } from '../regexReplace';

describe('RegexReplace', () => {
  const context = {};

  describe('condition', () => {
    it('应该对非空文本且有替换规则时返回true', () => {
      const parameters = { replacements: [['a', 'b']] };
      expect(regexReplace.condition(context, 'hello world', parameters)).toBe(true);
    });

    it('应该对空文本返回false', () => {
      const parameters = { replacements: [['a', 'b']] };
      expect(regexReplace.condition(context, '', parameters)).toBe(false);
    });

    it('应该对没有替换规则的文本返回false', () => {
      expect(regexReplace.condition(context, 'hello world', {})).toBe(false);
      expect(regexReplace.condition(context, 'hello world', { replacements: [] })).toBe(false);
    });
  });

  describe('process', () => {
    it('应该执行简单的字符串替换', () => {
      const input = 'hello world';
      const parameters = {
        replacements: [['hello', 'hi']],
        flags: 'g'
      };
      const expected = 'hi world';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该执行多个替换规则', () => {
      const input = 'hello world hello';
      const parameters = {
        replacements: [
          ['hello', 'hi'],
          ['world', 'earth']
        ],
        flags: 'g'
      };
      const expected = 'hi earth hi';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该使用正则表达式进行替换', () => {
      const input = 'hello123world456';
      const parameters = {
        replacements: [
          ['\\d+', 'NUM']
        ],
        flags: 'g'
      };
      const expected = 'helloNUMworldNUM';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该处理大小写不敏感的替换', () => {
      const input = 'Hello HELLO hello';
      const parameters = {
        replacements: [
          ['hello', 'hi']
        ],
        flags: 'gi'
      };
      const expected = 'hi hi hi';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该处理多行文本', () => {
      const input = 'line1\nline2\nline3';
      const parameters = {
        replacements: [
          ['^line', 'newline']
        ],
        flags: 'gm'
      };
      const expected = 'newline1\nnewline2\nnewline3';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该跳过空的pattern', () => {
      const input = 'hello world';
      const parameters = {
        replacements: [
          ['', 'test'],
          ['hello', 'hi']
        ],
        flags: 'g'
      };
      const expected = 'hi world';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该处理无效的正则表达式', () => {
      const input = 'hello world';
      const parameters = {
        replacements: [
          ['[', 'test'], // 无效的正则表达式
          ['hello', 'hi']
        ],
        flags: 'g'
      };
      const expected = 'hi world';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该使用默认参数', () => {
      const input = 'hello world';
      const parameters = {
        replacements: [['hello', 'hi']]
      };
      const expected = 'hi world';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该在没有替换规则时返回原文本', () => {
      const input = 'hello world';
      const parameters = {
        replacements: []
      };
      const expected = 'hello world';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该处理复杂的正则表达式', () => {
      const input = 'apple123banana456cherry789';
      const parameters = {
        replacements: [
          ['([a-z]+)(\\d+)', '$2-$1']
        ],
        flags: 'g'
      };
      const expected = '123-apple456-banana789-cherry';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该处理空字符串输入', () => {
      const input = '';
      const parameters = {
        replacements: [['a', 'b']]
      };
      const expected = '';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });

    it('应该处理没有匹配的文本', () => {
      const input = 'hello world';
      const parameters = {
        replacements: [['xyz', 'test']]
      };
      const expected = 'hello world';
      expect(regexReplace.process(context, input, parameters)).toBe(expected);
    });
  });
}); 