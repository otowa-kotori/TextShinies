import { describe, it, expect, beforeEach } from 'vitest';
import { registerTool, getTool, getAllTools } from '../index';
import { trimWhitespace } from '../trimWhitespace';
import { regexReplace } from '../regexReplace';
import { fullwidthToHalfwidth } from '../fullwidthToHalfwidth';
import { mergeSplitLines } from '../mergeSplitLines';

describe('Tools Registry', () => {
  beforeEach(() => {
    // 清空工具注册表（通过重新导入模块）
    // 注意：在实际项目中，可能需要更好的方式来重置状态
  });

  describe('registerTool', () => {
    it('应该能够注册工具', () => {
      // 测试工具注册功能
      expect(() => {
        registerTool(trimWhitespace);
      }).not.toThrow();
    });

    it('应该能够注册多个工具', () => {
      expect(() => {
        registerTool(trimWhitespace);
        registerTool(regexReplace);
        registerTool(fullwidthToHalfwidth);
        registerTool(mergeSplitLines);
      }).not.toThrow();
    });
  });

  describe('getTool', () => {
    it('应该能够获取已注册的工具', () => {
      registerTool(trimWhitespace);
      const tool = getTool('TrimWhitespace');
      expect(tool).toBeDefined();
      expect(tool?.name).toBe('TrimWhitespace');
    });

    it('应该对未注册的工具返回undefined', () => {
      const tool = getTool('NonExistentTool');
      expect(tool).toBeUndefined();
    });
  });

  describe('getAllTools', () => {
    it('应该返回所有已注册的工具', () => {
      registerTool(trimWhitespace);
      registerTool(regexReplace);
      registerTool(fullwidthToHalfwidth);
      registerTool(mergeSplitLines);

      const tools = getAllTools();
      expect(tools).toHaveLength(4);
      expect(tools.map(t => t.name)).toContain('TrimWhitespace');
      expect(tools.map(t => t.name)).toContain('RegexReplace');
      expect(tools.map(t => t.name)).toContain('FullwidthToHalfwidth');
      expect(tools.map(t => t.name)).toContain('MergeSplitLines');
    });
  });

  describe('Tool Properties', () => {
    it('所有工具都应该有正确的属性结构', () => {
      const tools = [trimWhitespace, regexReplace, fullwidthToHalfwidth, mergeSplitLines];
      
      tools.forEach(tool => {
        expect(tool).toHaveProperty('name');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('dependencies');
        expect(tool).toHaveProperty('parameters');
        expect(tool).toHaveProperty('condition');
        expect(tool).toHaveProperty('process');
        
        expect(typeof tool.name).toBe('string');
        expect(typeof tool.description).toBe('string');
        expect(Array.isArray(tool.dependencies)).toBe(true);
        expect(Array.isArray(tool.parameters)).toBe(true);
        expect(typeof tool.condition).toBe('function');
        expect(typeof tool.process).toBe('function');
      });
    });

    it('工具名称应该是唯一的', () => {
      const tools = [trimWhitespace, regexReplace, fullwidthToHalfwidth, mergeSplitLines];
      const names = tools.map(t => t.name);
      const uniqueNames = new Set(names);
      expect(uniqueNames.size).toBe(names.length);
    });
  });
}); 