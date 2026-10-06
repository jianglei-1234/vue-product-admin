<script setup>
// ============================================================
// App.vue：根组件
// 整体布局：sidebar（左）+ right-area（右：topbar + content）
// ============================================================
import { ref } from 'vue'
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

// ============ 主题切换（新增） ============
// 暗黑模式开关：状态存 localStorage，刷新页面后保持上次选择
const isDark = ref(localStorage.getItem('theme') === 'dark')

// 页面一启动就把主题写到 <html> 标签上
// main.css 里用 [data-theme="dark"] 覆盖 CSS 变量，实现整站换色
document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

function toggleTheme() {
    isDark.value = !isDark.value
    document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric', month: '2-digit', day: '2-digit',
})
</script>

<template>
  <div class="app">
    <!-- 左侧栏 -->
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">🛒</span>
        <span class="logo-text">商品管理系统</span>
      </div>
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
          <!-- nav-label：窄屏下这个文字会被隐藏，只留图标 -->
          <span class="nav-label">{{ m.label }}</span>
        </RouterLink>
      </nav>

      <!-- 主题开关（新增）：margin-top:auto 把它推到侧边栏最底部 -->
      <div class="theme-toggle" @click="toggleTheme">
        <span class="nav-icon">{{ isDark ? '☀️' : '🌙' }}</span>
        <span class="nav-label">{{ isDark ? '切换亮色' : '切换暗色' }}</span>
      </div>
    </aside>

    <!-- 右侧区域 -->
    <div class="right-area">
      <header class="topbar">
        <div class="topbar-left">
          <span class="topbar-title">商品列表</span>
        </div>
        <div class="topbar-right">
          <span class="date">{{ today }}</span>
          <div class="avatar">姜</div>
        </div>
      </header>

      <main class="content">
        <!-- 路由切换过渡（新增）：
             v-slot 拿到当前路由组件，套 <Transition> 做淡入上移动画，
             mode="out-in" = 旧页面先退场、新页面再进场，避免两个页面叠在一起 -->
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
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
  background: var(--bg-sidebar);   /* 原来写死 #1e293b，改用变量以适配暗黑主题 */
  color: #cbd5e1;
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex-shrink: 0;
  transition: width .2s;           /* 窄屏收窄时有个平滑过渡 */
}
.sidebar .logo {
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  padding: 0 20px;
  margin-bottom: 30px;
  white-space: nowrap;             /* 收窄时不许文字换行，配合 overflow 裁切 */
  overflow: hidden;
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
  white-space: nowrap;
  overflow: hidden;
}
.nav-item:hover { background: rgba(255, 255, 255, .05); }
.nav-item.active {
  background: var(--primary);
  color: #fff;
}
.nav-icon { font-size: 16px; }

/* 主题开关（新增）：外观对齐 nav-item，但只是个 div 不是链接 */
.theme-toggle {
  margin-top: auto;                /* 关键：flex 布局里把它推到最底部 */
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: inherit;
  white-space: nowrap;
  overflow: hidden;
  transition: background .15s;
}
.theme-toggle:hover { background: rgba(255, 255, 255, .05); }

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
  background: var(--bg-card);      /* 原来写死 #fff，改用变量以适配暗黑主题 */
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

/* ============ 路由切换过渡（新增） ============ */
/* 新页面淡入 + 轻微上移；旧页面淡出 + 轻微上移离场 */
.page-enter-active,
.page-leave-active { transition: opacity .18s ease, transform .18s ease; }
.page-enter-from { opacity: 0; transform: translateY(8px); }
.page-leave-to   { opacity: 0; transform: translateY(-8px); }

/* ============ Toast 过渡 ============ */
.fade-enter-active,
.fade-leave-active { transition: opacity .2s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* ============ 响应式（新增）：窄屏下侧边栏收成图标栏 ============ */
/* 768px 是常见的"手机/平板分界线"，比它窄就只留图标 */
@media (max-width: 768px) {
  .sidebar { width: 64px; }
  .sidebar .logo {
    padding: 0;                    /* 去掉左右 padding，让图标居中 */
    text-align: center;
  }
  .logo-text { display: none; }    /* 隐藏文字只留 🛒 */
  .nav-item {
    justify-content: center;       /* 图标居中 */
    padding: 14px 0;               /* 上下加大 padding 方便手指点 */
  }
  .nav-label { display: none; }    /* 隐藏菜单文字 */
  .theme-toggle {
    justify-content: center;
    padding: 14px 0;
  }
  .topbar { padding: 0 12px; }
  .content { padding: 12px; }
}
</style>
