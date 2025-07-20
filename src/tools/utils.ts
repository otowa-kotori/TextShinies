// 辅助函数：从参数定义中提取默认值
export function getDefaultValues(parameters: any[]) {
  const defaults: Record<string, any> = {};
  parameters.forEach(param => {
    if (param.defaultValue !== undefined) {
      defaults[param.name] = param.defaultValue;
    }
  });
  return defaults;
} 