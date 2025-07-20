import type { Tool } from '../types';
import { getDefaultValues } from './utils';

export const mergeSplitLines: Tool = {
  name: 'MergeSplitLines',
  description: '合并被强制换行的文本行',
  dependencies: [],
  parameters: [
    {
      name: 'widthRangeRatio',
      description: '宽度相似度范围比例（相对于最大宽度）',
      defaultValue: 0.1
    },
    {
      name: 'minLineCount',
      description: '最少需要多少行宽度相似',
      defaultValue: 3
    },
    {
      name: 'maxWidth',
      description: '最大行宽度（像素）',
      defaultValue: 800
    }
  ],
  condition: (context, text, parameters) => {
    return text.length > 0;
  },
  process: (context, text, parameters = {}) => {
    const defaults = getDefaultValues(mergeSplitLines.parameters);
    const { widthRangeRatio, minLineCount, maxWidth } = { ...defaults, ...parameters };

    console.log('mergeSplitLines 开始处理，参数:', { widthRangeRatio, minLineCount, maxWidth });

    // 获取measureText函数
    var measureText = context.measureText;
    if (!measureText) {
      // 如果没有measureText函数，则使用string长度作为宽度
      measureText = (text: string) => text.length;
      console.log('使用字符串长度作为宽度测量');
    } else {
      console.log('使用context.measureText函数测量宽度');
    }

    // 按行分割文本
    const lines = text.split('\n');
    console.log(`文本分割为 ${lines.length} 行`);
    
    if (lines.length < minLineCount) {
      console.log(`行数 ${lines.length} 少于最小要求 ${minLineCount}，直接返回原文本`);
      return text;
    }

    // 测量每行宽度
    const lineWidths: { index: number; width: number }[] = [];
    for (let i = 0; i < lines.length; i++) {
      const width = measureText(lines[i]);
      if (width <= maxWidth) {
        lineWidths.push({ index: i, width });
      }
    }

    console.log(`测量到 ${lineWidths.length} 行宽度在最大宽度 ${maxWidth} 以内`);
    //console.log('行宽度详情:', lineWidths.map(lw => `第${lw.index}行: ${lw.width}`));

    if (lineWidths.length < minLineCount) {
      console.log(`有效行数 ${lineWidths.length} 少于最小要求 ${minLineCount}，直接返回原文本`);
      return text;
    }

    // 计算实际的最大宽度和宽度范围
    const maxMeasuredWidth = Math.max(...lineWidths.map(lw => lw.width));
    const widthRange = maxMeasuredWidth * widthRangeRatio;
    
    console.log(`实际最大宽度: ${maxMeasuredWidth}, 宽度范围: ${widthRange} (${widthRangeRatio * 100}%)`);

    // 滑动窗口分析，找出行数最多的宽度范围
    let maxCount = 0;
    let bestCenterWidth = 0;

    for (const { width } of lineWidths) {
      let count = 0;
      for (const { width: otherWidth } of lineWidths) {
        if (Math.abs(width - otherWidth) <= widthRange) {
          count++;
        }
      }
      if (count > maxCount) {
        maxCount = count;
        bestCenterWidth = width;
      }
    }

    // 如果相似宽度的行数不够，直接返回原文本
    if (maxCount < minLineCount) {
      console.log(`相似宽度的行数 ${maxCount} 少于最小要求 ${minLineCount}，直接返回原文本`);
      return text;
    }

    console.log(`找到最佳中心宽度: ${bestCenterWidth}，相似行数: ${maxCount}`);

    // 标记需要拼接的行
    const shouldMerge: boolean[] = new Array(lines.length).fill(false);
    for (let i = 0; i < lines.length; i++) {
      const width = measureText(lines[i]);
      if (Math.abs(width - bestCenterWidth) <= widthRange) {
        shouldMerge[i] = true;
      }
    }

    const mergeCount = shouldMerge.filter(Boolean).length;
    console.log(`标记了 ${mergeCount} 行需要合并`);
    // console.log('合并标记:', shouldMerge.map((merge, i) => `第${i}行: ${merge ? '合并' : '保留'}`));

    // 拼接连续的标记行
    const result: string[] = [];
    let i = 0;
    
    while (i < lines.length) {
      if (!shouldMerge[i]) {
        // 不需要拼接的行直接添加
        result.push(lines[i]);
        i++;
      } else {
        // 找到连续的标记行进行拼接
        let mergedLine = lines[i];
        i++;
        
        while (i < lines.length && shouldMerge[i]) {
          mergedLine += lines[i];
          i++;
        }
        // 如果下一个行未被标记，且还在连续合并块的末尾，则也合并进来
        if (i < lines.length && !shouldMerge[i]) {
          mergedLine += lines[i];
          i++;
        }
        result.push(mergedLine);
      }
    }

    const finalResult = result.join('\n');
    console.log(`合并完成，从 ${lines.length} 行合并为 ${result.length} 行`);
    console.log('最终结果行数:', result.length);
    return finalResult;
  }
}; 