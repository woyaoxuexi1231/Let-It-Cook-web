<template>
  <el-container class="admin-container">
    <el-aside width="220px">
      <div class="logo">
        <el-icon :size="24" color="#fff"><Dish /></el-icon>
        <span>随缘吃饭</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="admin-menu"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        :collapse-transition="false"
      >
        <el-menu-item index="/dish">
          <el-icon><Menu /></el-icon>
          <span>菜谱管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>菜谱管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Dish, Menu } from '@element-plus/icons-vue'

const route = useRoute()
const activeMenu = ref('/dish')

watch(() => route.path, (newPath) => {
  activeMenu.value = newPath
}, { immediate: true })
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.admin-container {
  height: 100vh;
}

.el-aside {
  background: #304156;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  transition: width 0.3s;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: #2b3a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.admin-menu {
  border: none;
  background: #304156;
}

.admin-menu .el-menu-item {
  height: 50px;
  line-height: 50px;
  margin: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

.admin-menu .el-menu-item:hover {
  background: #263445 !important;
  color: #fff !important;
}

.admin-menu .el-menu-item.is-active {
  background: #409eff !important;
  color: #fff !important;
}

.admin-header {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
}

.el-main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
