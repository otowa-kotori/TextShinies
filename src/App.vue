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
  padding: 15px 20px;
  display: flex;
  gap: 10px;
}

.navigation button {
  background: none;
  border: none;
  color: white;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.navigation button:hover {
  background-color: #555;
}

.navigation button.active {
  background-color: #007bff;
}

.main-content {
  background-color: white;
  min-height: calc(100vh - 60px);
}
</style>
