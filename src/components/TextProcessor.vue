<template>
  <div class="text-processor">
    <!-- 不可见的 canvas 用于测量文本宽度 -->
    <canvas ref="measureCanvas" style="position: absolute; left: -9999px; top: -9999px;"></canvas>
    
    <h1>文本处理工具</h1>
    
    <div class="pipeline-selector">
      <label for="pipeline">选择流水线：</label>
      <select id="pipeline" v-model="selectedPipeline" @change="onPipelineChange">
        <option value="">请选择流水线</option>
        <option v-for="pipeline in pipelines" :key="pipeline.id" :value="pipeline.id">
          {{ pipeline.name }} - {{ pipeline.description }}
        </option>
      </select>
    </div>

    <div class="text-areas">
      <div class="input-area">
        <label for="input-text">输入文本：</label>
        <textarea 
          id="input-text" 
          v-model="inputText" 
          placeholder="请输入要处理的文本..."
          rows="10"
        ></textarea>
      </div>

      <div class="output-area">
        <label for="output-text">输出文本：</label>
        <textarea 
          id="output-text" 
          v-model="outputText" 
          placeholder="处理结果将显示在这里..."
          rows="10"
          readonly
        ></textarea>
      </div>
    </div>

    <div class="actions">
      <button @click="processText" :disabled="!selectedPipeline || !inputText.trim()">
        转换文本
      </button>
      <button @click="clearAll">清空</button>
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPipelines, executePipeline } from '../pipelines';
import type { Pipeline, Context } from '../types';

const inputText = ref('');
const outputText = ref('');
const selectedPipeline = ref('');
const pipelines = ref<Pipeline[]>([]);
const error = ref('');
const measureCanvas = ref<HTMLCanvasElement>();

onMounted(() => {
  pipelines.value = getPipelines();
});

const onPipelineChange = () => {
  error.value = '';
  outputText.value = '';
};

const processText = () => {
  if (!selectedPipeline.value || !inputText.value.trim()) {
    return;
  }

  // 使用模板中的 canvas 进行文本宽度测量
  const canvas = measureCanvas.value;
  if (!canvas) {
    error.value = 'Canvas 元素未找到';
    return;
  }
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    error.value = '无法获取 canvas 上下文';
    return;
  }
  
  // 设置字体样式（可以根据需要调整）
  ctx.font = '14px sans-serif';

  const context: Context = {
    measureText: (text: string) => {
      return ctx.measureText(text).width;
    }
  };

  const result = executePipeline(selectedPipeline.value, inputText.value, context);
  
  if (result.success) {
    outputText.value = result.output;
    error.value = '';
  } else {
    error.value = result.error || '处理失败';
    outputText.value = '';
  }
};

const clearAll = () => {
  inputText.value = '';
  outputText.value = '';
  error.value = '';
};
</script>

<style scoped>
.text-processor {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
}

.pipeline-selector {
  margin-bottom: 30px;
}

.pipeline-selector label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.pipeline-selector select {
  width: 100%;
  max-width: 600px;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}

.text-areas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 30px;
}

.input-area, .output-area {
  display: flex;
  flex-direction: column;
}

.input-area label, .output-area label {
  margin-bottom: 5px;
  font-weight: bold;
}

textarea {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  min-height: 300px;
}

.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:last-child {
  background-color: #6c757d;
}

button:last-child:hover {
  background-color: #545b62;
}

.error {
  color: red;
  padding: 10px;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}
</style> 