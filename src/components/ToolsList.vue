<template>
  <div class="tools-list">
    <h1>工具列表</h1>
    
    <div class="tools-grid">
      <div 
        v-for="tool in tools" 
        :key="tool.name" 
        class="tool-card"
      >
        <div class="tool-header">
          <h3>{{ tool.name }}</h3>
        </div>
        
        <div class="tool-content">
          <p class="tool-description">{{ tool.description }}</p>
          
          <!-- 工具参数 -->
          <div v-if="tool.parameters.length > 0" class="tool-parameters">
            <h4>参数</h4>
            <ul>
              <li v-for="param in tool.parameters" :key="param.name">
                <strong>{{ param.name }}</strong> - {{ param.description }}
                <span v-if="param.defaultValue !== undefined" class="param-default">
                  （默认值: <code>{{ param.defaultValue }}</code>）
                </span>
              </li>
            </ul>
          </div>
          
          <!-- 工具依赖 -->
          <div v-if="tool.dependencies.length > 0" class="tool-dependencies">
            <h4>依赖</h4>
            <ul>
              <li v-for="dep in tool.dependencies" :key="dep">
                {{ dep }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllTools } from '../tools';
import type { Tool } from '../types';

const tools = ref<Tool[]>([]);

onMounted(() => {
  tools.value = getAllTools();
});
</script>

<style scoped>
.tools-list {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.tool-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: all 0.2s;
}

.tool-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.tool-header h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.2em;
}

.tool-content {
  color: #666;
}

.tool-description {
  margin: 0 0 15px 0;
  line-height: 1.5;
}

.tool-parameters, .tool-dependencies {
  margin: 15px 0;
}

.tool-parameters h4, .tool-dependencies h4 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 1em;
}

.tool-parameters ul, .tool-dependencies ul {
  margin: 0;
  padding-left: 20px;
}

.tool-parameters li, .tool-dependencies li {
  margin: 4px 0;
  line-height: 1.4;
}

.tool-parameters strong {
  color: #495057;
}

.param-default {
  color: #28a745;
  font-size: 0.9em;
  margin-left: 8px;
}

.param-default code {
  background-color: #f8f9fa;
  padding: 2px 4px;
  border-radius: 3px;
  font-family: monospace;
}
</style> 