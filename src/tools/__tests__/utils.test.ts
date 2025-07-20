import { describe, it, expect } from 'vitest';
import { getDefaultValues } from '../utils';

describe('Utils', () => {
  describe('getDefaultValues', () => {
    it('应该从参数定义中提取默认值', () => {
      const parameters = [
        {
          name: 'param1',
          description: 'First parameter',
          defaultValue: 'default1'
        },
        {
          name: 'param2',
          description: 'Second parameter',
          defaultValue: 42
        },
        {
          name: 'param3',
          description: 'Third parameter',
          defaultValue: true
        }
      ];

      const result = getDefaultValues(parameters);
      
      expect(result).toEqual({
        param1: 'default1',
        param2: 42,
        param3: true
      });
    });

    it('应该处理没有默认值的参数', () => {
      const parameters = [
        {
          name: 'param1',
          description: 'First parameter',
          defaultValue: 'default1'
        },
        {
          name: 'param2',
          description: 'Second parameter'
          // 没有defaultValue
        },
        {
          name: 'param3',
          description: 'Third parameter',
          defaultValue: null
        }
      ];

      const result = getDefaultValues(parameters);
      
      expect(result).toEqual({
        param1: 'default1',
        param3: null
      });
    });

    it('应该处理空参数数组', () => {
      const parameters: any[] = [];
      const result = getDefaultValues(parameters);
      
      expect(result).toEqual({});
    });

    it('应该处理undefined默认值', () => {
      const parameters = [
        {
          name: 'param1',
          description: 'First parameter',
          defaultValue: undefined
        },
        {
          name: 'param2',
          description: 'Second parameter',
          defaultValue: 'default2'
        }
      ];

      const result = getDefaultValues(parameters);
      
      expect(result).toEqual({
        param2: 'default2'
      });
    });

    it('应该处理复杂类型的默认值', () => {
      const parameters = [
        {
          name: 'arrayParam',
          description: 'Array parameter',
          defaultValue: [1, 2, 3]
        },
        {
          name: 'objectParam',
          description: 'Object parameter',
          defaultValue: { key: 'value' }
        },
        {
          name: 'functionParam',
          description: 'Function parameter',
          defaultValue: () => 'test'
        }
      ];

      const result = getDefaultValues(parameters);
      
      expect(result).toEqual({
        arrayParam: [1, 2, 3],
        objectParam: { key: 'value' },
        functionParam: expect.any(Function)
      });
    });
  });
}); 