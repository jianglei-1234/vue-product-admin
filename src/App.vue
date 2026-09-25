<script setup>
// ============================================================
// App.vue：根组件
// 整体布局：sidebar（左）+ right-area（右：topbar + content）
// ============================================================
import { RouterView } from 'vue-router'
import { useProductStore } from './stores/product'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const { toastMsg } = storeToRefs(store)

// 侧边栏菜单（RouterLink 自动管理 active 高亮）
const menus = [
    { to: '/',          icon: '📦', label: '商品管理' },
    { to: '/dashboard', icon: '📊', label: '数据统计' },
]
</script>

<template>
  <div class="app">
    <!-- 左侧栏 -->
    <aside class="sidebar">
      <div class="logo">🛒 商品管理系统</div>
      <nav class="nav-menu">
        <RouterLink
          v-for="(m, i) in menus"
          :key="i"
          :to="m.to"
          class="nav-item"
          active-class="active"
          exact-active-class="active"
        >
          <span class="nav-icon">{{ m.icon }}</span>
          <span>{{ m.label }}</span>
        </RouterLink>
      </nav>
    </aside>

    <!-- 右侧区域 -->
    <div class="right-area">
      <header class="topbar">
        <div class="topbar-left">
          <span class="topbar-title">商品列表</span>
        </div>
        <div class="topbar-right">
          <span class="date">2026-09-17</span>
          <div class="avatar">刘</div>
        </div>
      </header>

      <main class="content">
        <RouterView />
      </main>
    </div>

    <!-- 全局 Toast 提示 -->
    <transition name="fade">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </transition>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  background: var(--bg-page);
}

/* ============ 侧边栏 ============ */
.sidebar {
  width: 220px;
  background: #1e293b;
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex-shrink: 0;
}
.sidebar .logo {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  padding: 0 20px;
  margin-bottom: 30px;
}
.nav-item {
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: inherit;
  transition: background .15s;
}
.nav-item:hover { background: rgba(255, 255, 255, .05); }
.nav-item.active {
  background: var(--primary);
  color: #fff;
}
.nav-icon { font-size: 16px; }

/* ============ 右侧区域 ============ */
.right-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ============ 顶栏 ============ */
.topbar {
  height: 60px;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .08);
  flex-shrink: 0;
}
.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.topbar-title {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-main);
}
.date {
  font-size: 13px;
  color: var(--text-sub);
}
.avatar {
  width: 36px;
  height: 36px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
}

/* ============ 内容区 ============ */
.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

/* ============ Toast 过渡 ============ */
.fade-enter-active,
.fade-leave-active { transition: opacity .2s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>