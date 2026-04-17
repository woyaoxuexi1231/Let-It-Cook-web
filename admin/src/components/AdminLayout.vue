<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1 class="logo">Let It Cook</h1>
        <button 
          class="theme-toggle" 
          @click="toggleTheme"
          aria-label="Toggle theme"
        >
          {{ isDark ? '☀️' : '🌙' }}
        </button>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: route.path === '/' }">
            <a href="/#/" @click.prevent="router.push('/')">
              <span class="nav-icon">🍳</span>
              <span class="nav-text">Recipe Management</span>
            </a>
          </li>
          <li>
            <a href="/#/landing" @click.prevent="router.push('/landing')">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Landing Page</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark-theme', isDark.value)
}

const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) {
    isDark.value = savedTheme === 'dark'
    document.documentElement.classList.toggle('dark-theme', isDark.value)
  }
}

initTheme()
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

.admin-layout {
  display: flex;
  gap: 24px;
  padding: 24px;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  height: calc(100vh - 48px);
  border-radius: 16px;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.theme-toggle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background-color: var(--bg-card);
  color: var(--text-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.theme-toggle:hover {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  padding: 16px 0;
  flex: 1;
}

.sidebar-nav ul {
  list-style: none;
}

.sidebar-nav li {
  margin: 0;
}

.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
}

.sidebar-nav a:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-left-color: var(--text-primary);
}

.sidebar-nav li.active a {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border-left-color: var(--text-primary);
  font-weight: 500;
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-size: 14px;
}

.content {
  flex: 1;
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: auto;
  min-height: calc(100vh - 48px);
}

.content > * {
  height: 100%;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }

  .sidebar {
    width: 100%;
    height: auto;
  }

  .content {
    min-height: auto;
  }
}
</style>