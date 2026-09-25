<script setup>
// ============================================================
// Charts 组件：ECharts 柱状图 + 饼图
// 数据来源：store.categoryStock（每个分类的总库存）
// ============================================================
import { ref, onMounted, onUnmounted, watch } from 'vue' // 导入 Vue 的响应式、生命周期和监听函数
import * as echarts from 'echarts' // 导入 ECharts 图表库
import { useProductStore } from '../stores/product' // 导入 Pinia Store，用于获取产品数据
import { storeToRefs } from 'pinia' // 导入 storeToRefs，用于将 store 中的响应式数据解构出来

const store = useProductStore() // 创建当前产品数据 Store 实例
const { categoryStock } = storeToRefs(store) // 获取分类库存的响应式引用数据

// 两个图表容器 ref + 实例
const barRef = ref(null) // 柱状图容器的引用
const pieRef = ref(null) // 饼图容器的引用
let barChart = null // 柱状图实例变量
let pieChart = null // 饼图实例变量

// 柱状图配置
function renderBar() { // 定义 renderBar 函数，用于更新柱状图数据
    if (!barChart || !barRef.value) return // 如果图表实例未创建或容器不存在，则直接返回
    const categories = Object.keys(categoryStock.value) // 提取所有分类名称
    const stocks = Object.values(categoryStock.value) // 提取每个分类对应的库存数量
    barChart.setOption({ // 调用 ECharts 的 setOption 更新柱状图配置
        title:  { text: '库存统计', left: 'center' }, // 设置图表标题，并让其居中显示
        tooltip:{ trigger: 'axis' }, // 设置鼠标悬停时显示坐标轴提示
        xAxis:  { type: 'category', data: categories }, // 设置 x 轴为分类名称
        yAxis:  { type: 'value' }, // 设置 y 轴为数值轴
        series: [{ data: stocks, type: 'bar', itemStyle: { color: '#4e79a7' } }], // 设置柱状图的数据、类型和颜色
    }, true) // 使用 true 进行增量更新，保留此前配置
}

// 饼图配置
function renderPie() { // 定义 renderPie 函数，用于更新饼图数据
    if (!pieChart || !pieRef.value) return // 如果图表实例未创建或容器不存在，则直接返回
    const data = Object.keys(categoryStock.value).map(k => ({ // 将分类数据转换成饼图所需的数组格式
        name: k, // 每个分类的名称
        value: categoryStock.value[k] // 每个分类对应的库存值
    }))
    pieChart.setOption({ // 调用 ECharts 的 setOption 更新饼图配置
        title:  { text: '各分类的占比库存', left: 'center' }, // 设置饼图标题，并让其居中显示
        tooltip:{ trigger: 'item' }, // 设置鼠标悬停时显示单项提示
        series: [{ type: 'pie', data, radius: '60%' }], // 设置饼图类型、数据和半径
    },true) // 使用 true 进行增量更新，保留此前配置
}

// 第一次挂载：创建实例 + 第一次画图
onMounted(() => { // 组件挂载后执行初始化逻辑
    barChart = echarts.init(barRef.value) // 创建柱状图实例并绑定到柱状图容器
    pieChart = echarts.init(pieRef.value) // 创建饼图实例并绑定到饼图容器
    renderBar() // 首次渲染柱状图
    renderPie() // 首次渲染饼图
})

// 数据变了 → 自动重新画图
watch(categoryStock, () => { // 监听 categoryStock 的变化
    renderBar() // 数据更新后重新渲染柱状图
    renderPie() // 数据更新后重新渲染饼图
}, { deep: true }) // 深度监听对象属性变化

// 卸载时销毁实例（避免内存泄漏）
onUnmounted(() => { // 组件卸载前执行清理逻辑
    barChart?.dispose() // 销毁柱状图实例，释放浏览器内存
    pieChart?.dispose() // 销毁饼图实例，释放浏览器内存
})
</script>

<template>
  <div class="chart-wrap"> <!-- 图表外层容器，用来放置两个图表并排展示 -->
    <div ref="barRef" class="chart"></div> <!-- 柱状图挂载节点 -->
    <div ref="pieRef" class="chart"></div> <!-- 饼图挂载节点 -->
  </div> <!-- 图表容器结束 -->
</template>

<style scoped>
.chart-wrap { /* 整体图表布局容器 */
  display: grid; /* 使用 CSS Grid 布局 */
  grid-template-columns: 1fr 1fr;  /* 柱状图 + 饼图 并排 */
  gap: 16px; /* 两个图表之间的间距 */
  margin-bottom: 16px; /* 下方留白 */
}
.chart { /* 每个图表的通用样式 */
  width: 100%; /* 宽度占满父容器 */
  height: 320px; /* 图表固定高度 */
  background: var(--bg-card); /* 使用卡片背景色 */
  border-radius: 10px; /* 圆角边框 */
}
</style>