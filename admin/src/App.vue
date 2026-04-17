<template>
  <div id="app">
    <AdminLayout v-if="!isLandingPage">
      <router-view />
    </AdminLayout>
    <router-view v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'

const route = useRoute()
const isLandingPage = computed(() => route.path === '/landing')
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
  font-size: 14px;
  line-height: 1.5;
}

:root {
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --bg-card: #ffffff;
  --border-color: #e5e5e5;
  --text-primary: #1a1a1a;
  --text-secondary: #666666;
  --text-muted: #a0a0a0;
}

:root.dark-theme {
  --bg-primary: #0a0a0a;
  --bg-secondary: #1a1a1a;
  --bg-card: #1a1a1a;
  --border-color: #333333;
  --text-primary: #f5f5f5;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;
}

#app {
  width: 100%;
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}
</style>