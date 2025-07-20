<script setup lang="ts">
import { ref } from 'vue';
import TextProcessor from './components/TextProcessor.vue';
import PipelineEditor from './components/PipelineEditor.vue';

const currentPage = ref<'processor' | 'editor'>('processor');
</script>

<template>
  <div id="app">
    <nav class="navigation">
      <button 
        @click="currentPage = 'processor'" 
        :class="{ active: currentPage === 'processor' }"
      >
        文本处理
      </button>
      <button 
        @click="currentPage = 'editor'" 
        :class="{ active: currentPage === 'editor' }"
      >
        流水线编辑
      </button>
    </nav>

    <main class="main-content">
      <TextProcessor v-if="currentPage === 'processor'" />
      <PipelineEditor v-if="currentPage === 'editor'" />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

#app {
  min-height: 100vh;
}

.navigation {
  background-color: #333;
  padding: 20px 30px;
  display: flex;
  gap: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.navigation button {
  background: none;
  border: none;
  color: white;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-size: 16px;
  font-weight: 500;
}

.navigation button:hover {
  background-color: #555;
}

.navigation button.active {
  background-color: #007bff;
}

.main-content {
  background-color: white;
}
</style>
