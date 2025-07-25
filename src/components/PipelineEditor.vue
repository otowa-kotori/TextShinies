<template>
  <div class="pipeline-editor">
    <h1>流水线编辑器</h1>
    
    <div class="pipelines-list">
      <h2>现有流水线</h2>
      <div v-if="pipelines.length === 0" class="no-pipelines">
        暂无流水线
      </div>
      <div v-else class="pipeline-items">
        <div 
          v-for="pipeline in pipelines" 
          :key="pipeline.id" 
          class="pipeline-item"
          :class="{ active: selectedPipeline?.id === pipeline.id }"
          @click="selectPipeline(pipeline)"
        >
          <h3>{{ pipeline.name }}</h3>
          <p>{{ pipeline.description }}</p>
          <div class="tools-count">
            工具数量: {{ pipeline.tools.length }}
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedPipeline" class="pipeline-details">
      <h2>流水线详情: {{ selectedPipeline.name }}</h2>
      <p>{{ selectedPipeline.description }}</p>
      
      <div class="tools-list">
        <h3>包含的工具</h3>
        <div v-if="selectedPipeline.tools.length === 0" class="no-tools">
          该流水线不包含任何工具
        </div>
        <div v-else class="tool-items">
          <div 
            v-for="(toolConfig, index) in selectedPipeline.tools" 
            :key="toolConfig.name"
            class="tool-item"
          >
            <div class="tool-header">
              <span class="tool-index">{{ index + 1 }}</span>
              <span class="tool-name">{{ toolConfig.name }}</span>
            </div>
            <div v-if="getTool(toolConfig.name)" class="tool-details">
              <p class="tool-description">{{ getTool(toolConfig.name)?.description }}</p>
              
              <!-- 工具参数配置 -->
              <div v-if="toolConfig.parameters && Object.keys(toolConfig.parameters).length > 0" class="tool-parameters">
                <strong>参数配置:</strong>
                <div class="parameter-list">
                  <div v-for="(value, key) in toolConfig.parameters" :key="key" class="parameter-item">
                    <span class="parameter-name">{{ key }}:</span>
                    <span class="parameter-value">{{ formatParameterValue(value) }}</span>
                  </div>
                </div>
              </div>
                            
              <div v-if="getTool(toolConfig.name)?.dependencies.length" class="tool-dependencies">
                <strong>依赖:</strong>
                <ul>
                  <li v-for="dep in getTool(toolConfig.name)?.dependencies" :key="dep">
                    {{ dep }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="tool-error">
              工具 {{ toolConfig.name }} 不存在
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getPipelines } from '../pipelines';
import { getTool } from '../tools';
import type { Pipeline } from '../types';

const pipelines = ref<Pipeline[]>([]);
const selectedPipeline = ref<Pipeline | null>(null);

onMounted(() => {
  pipelines.value = getPipelines();
});

const selectPipeline = (pipeline: Pipeline) => {
  selectedPipeline.value = pipeline;
};

const formatParameterValue = (value: any): string => {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }
  return String(value);
};
</script>

<style scoped>
.pipeline-editor {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
}

.pipelines-list {
  margin-bottom: 30px;
}

.pipeline-items {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.pipeline-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.pipeline-item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
}

.pipeline-item.active {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.pipeline-item h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.pipeline-item p {
  margin: 0 0 10px 0;
  color: #666;
}

.tools-count {
  font-size: 0.9em;
  color: #888;
}

.no-pipelines, .no-tools {
  text-align: center;
  color: #666;
  padding: 20px;
  border: 1px dashed #ddd;
  border-radius: 8px;
}

.pipeline-details {
  border-top: 2px solid #eee;
  padding-top: 20px;
}

.tools-list {
  margin-top: 20px;
}

.tool-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tool-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: #f9f9f9;
}

.tool-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.tool-index {
  background-color: #007bff;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8em;
  font-weight: bold;
  margin-right: 10px;
}

.tool-name {
  font-weight: bold;
  color: #333;
}

.tool-description {
  margin: 10px 0;
  color: #666;
}

.tool-parameters, .tool-parameter-definitions, .tool-dependencies {
  margin: 10px 0;
}

.parameter-list {
  margin: 5px 0;
}

.parameter-item {
  display: flex;
  margin: 2px 0;
  padding: 2px 0;
}

.parameter-name {
  font-weight: bold;
  color: #495057;
  min-width: 100px;
}

.parameter-value {
  color: #007bff;
  font-family: monospace;
}

.tool-parameter-definitions ul, .tool-dependencies ul {
  margin: 5px 0;
  padding-left: 20px;
}

.tool-parameter-definitions li, .tool-dependencies li {
  margin: 2px 0;
  color: #666;
}

.default-value {
  color: #28a745;
  font-size: 0.9em;
  margin-left: 10px;
}

.tool-error {
  color: #dc3545;
  font-style: italic;
}
</style> 