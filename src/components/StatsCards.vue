<script setup>
// ============================================================
// StatsCards 组件：4 张统计卡片（总商品/上架/下架/总库存）
// 数据来源：Pinia store 的 stats getter（自动响应式）
// ============================================================
import { ref, watch, onBeforeUnmount } from 'vue'
import { useProductStore } from '../stores/product'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const { stats } = storeToRefs(store)

// 4 张卡片配置（颜色 + 图标 + label + 数据键名）
const cards = [
    { key: 'total',  cls: 'blue',   icon: '📦', label: '总商品数' },
    { key: 'online', cls: 'green',  icon: '✅', label: '上架中' },
    { key: 'offline',cls: 'orange', icon: '⛔', label: '已下架' },
    { key: 'stock',  cls: 'purple', icon: '📊', label: '总库存（件）' },
]

// ============ 数字滚动（新增） ============
// 思路：stats 是"目标值"，display 是"当前显示值"。
// 数据一变就从旧值平滑滚动到新值（首屏从 0 滚上去，增删商品时从旧数滚到新数）。
const display = ref({ total: 0, online: 0, offline: 0, stock: 0 })

let rafId = null   // requestAnimationFrame 的任务 id，用来取消上一场没播完的动画

function animateTo(target) {
    cancelAnimationFrame(rafId)        // 数据连续变化时，打断上一场动画直接开新的
    const from = { ...display.value }  // 起点：当前屏幕上显示的数
    const duration = 500               // 动画总时长 500ms
    const start = performance.now()    // 动画开始的时间戳

    // 每一帧执行一次：根据"现在时刻"算出应该显示的数字
    function step(now) {
        const p = Math.min((now - start) / duration, 1)   // 进度 0 → 1
        const ease = 1 - Math.pow(1 - p, 3)               // easeOutCubic：先快后慢，观感更自然
        for (const key in target) {
            // 起点 + (终点 - 起点) * 进度 = 当前应显示的值
            display.value[key] = Math.round(from[key] + (target[key] - from[key]) * ease)
        }
        if (p < 1) rafId = requestAnimationFrame(step)    // 没播完就预约下一帧
    }
    rafId = requestAnimationFrame(step)
}

// immediate：组件首次挂载时也触发一次（首屏从 0 滚动到真实数据）
// deep：stats 是对象，深度监听才能捕捉到内部字段变化
watch(stats, (val) => animateTo({ ...val }), { immediate: true, deep: true })

// 组件卸载时取消动画任务，防止对已销毁组件继续写数据
onBeforeUnmount(() => cancelAnimationFrame(rafId))
</script>

<template>
  <div class="stats-row">
    <div
      v-for="card in cards"
      :key="card.key"
      class="stat-card"
      :class="card.cls"
    >
      <div class="stat-info">
        <!-- toLocaleString()：千分位显示（12345 → 12,345） -->
        <div class="stat-num">{{ display[card.key].toLocaleString() }}</div>
        <div class="stat-label">{{ card.label }}</div>
      </div>
      <div class="stat-icon">{{ card.icon }}</div>
    </div>
  </div>
</template>

<style scoped>
/* 一行四个等宽卡片（Grid 4 列均分） */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

/* 窄屏（新增）：手机上一行 4 个太挤，改成 2×2 */
@media (max-width: 768px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
}

.stat-card {
  background: var(--bg-card);
  border-radius: 10px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .06);
  border-top: 3px solid transparent;
  transition: transform .2s, box-shadow .2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, .1);
}

.stat-num {
  font-size: 28px;
  font-weight: bold;
  color: var(--text-main);
  font-variant-numeric: tabular-nums;  /* 等宽数字：滚动时数字不左右抖动 */
}
.stat-label {
  font-size: 13px;
  color: var(--text-sub);
  margin-top: 4px;
}

.stat-icon {
  font-size: 28px;
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 4 种配色变体（顶部彩条 + 图标底色） */
.stat-card.blue   { border-top-color: var(--primary); }
.stat-card.blue   .stat-icon { background: var(--tint-blue); }
.stat-card.green  { border-top-color: var(--success); }
.stat-card.green  .stat-icon { background: var(--success-bg); }
.stat-card.orange { border-top-color: var(--warning); }
.stat-card.orange .stat-icon { background: var(--tint-orange); }
.stat-card.purple { border-top-color: var(--purple); }
.stat-card.purple .stat-icon { background: var(--tint-purple); }
</style>
