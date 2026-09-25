// ============================================================
// 商品管理系统（Vue 版） - stores/product.js
// Pinia 组合式 API store：所有商品相关的 state/getters/actions 都在这里
// ============================================================
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

// 30 条默认假数据（4 大分类：电子产品 / 服装 / 家居 / 食品）
const DEFAULT_PRODUCTS = [
    {id:1,  name:'无线蓝牙耳机', category:'电子产品', price:199, stock:156, status:'上架中'},
    {id:2,  name:'纯棉T恤',      category:'服装',     price:59,  stock:320, status:'上架中'},
    {id:3,  name:'便携式保温杯', category:'家居',     price:89,  stock:6,   status:'已下架'},
    {id:4,  name:'智能手表',     category:'电子产品', price:899, stock:45,  status:'上架中'},
    {id:5,  name:'蓝牙音箱',     category:'电子产品', price:129, stock:88,  status:'上架中'},
    {id:6,  name:'无线鼠标',     category:'电子产品', price:79,  stock:200, status:'上架中'},
    {id:7,  name:'机械键盘',     category:'电子产品', price:299, stock:34,  status:'上架中'},
    {id:8,  name:'平板电脑',     category:'电子产品', price:1999,stock:12,  status:'上架中'},
    {id:9,  name:'游戏手柄',     category:'电子产品', price:249, stock:60,  status:'已下架'},
    {id:10, name:'路由器',       category:'电子产品', price:159, stock:75,  status:'上架中'},
    {id:11, name:'牛仔裤',       category:'服装',     price:129, stock:150, status:'上架中'},
    {id:12, name:'运动卫衣',     category:'服装',     price:149, stock:90,  status:'上架中'},
    {id:13, name:'羽绒服',       category:'服装',     price:599, stock:25,  status:'上架中'},
    {id:14, name:'格子衬衫',     category:'服装',     price:99,  stock:110, status:'上架中'},
    {id:15, name:'休闲短裤',     category:'服装',     price:69,  stock:180, status:'上架中'},
    {id:16, name:'针织毛衣',     category:'服装',     price:189, stock:40,  status:'已下架'},
    {id:17, name:'连帽卫衣',     category:'服装',     price:139, stock:95,  status:'上架中'},
    {id:18, name:'台灯',         category:'家居',     price:99,  stock:65,  status:'上架中'},
    {id:19, name:'床上四件套',   category:'家居',     price:259, stock:30,  status:'上架中'},
    {id:20, name:'收纳箱',       category:'家居',     price:49,  stock:210, status:'上架中'},
    {id:21, name:'落地衣架',     category:'家居',     price:119, stock:55,  status:'上架中'},
    {id:22, name:'陶瓷餐具',     category:'家居',     price:169, stock:42,  status:'上架中'},
    {id:23, name:'香薰蜡烛',     category:'家居',     price:39,  stock:130, status:'已下架'},
    {id:24, name:'坚果礼盒',     category:'食品',     price:129, stock:85,  status:'上架中'},
    {id:25, name:'挂耳咖啡',     category:'食品',     price:79,  stock:140, status:'上架中'},
    {id:26, name:'蜂蜜',         category:'食品',     price:59,  stock:96,  status:'上架中'},
    {id:27, name:'燕麦片',       category:'食品',     price:45,  stock:170, status:'上架中'},
    {id:28, name:'牛肉干',       category:'食品',     price:89,  stock:105, status:'已下架'},
    {id:29, name:'螺蛳粉',       category:'食品',     price:35,  stock:260, status:'上架中'},
    {id:30, name:'红枣',         category:'食品',     price:29,  stock:220, status:'上架中'},
]

export const useProductStore = defineStore('product', () => {
    // ==========================================================
    // ===== 1. state（响应式状态）=====
    // ==========================================================
    // 商品列表：保存所有商品数据，默认使用 DEFAULT_PRODUCTS。
    const products = ref([...DEFAULT_PRODUCTS])   // 商品数组（深拷贝避免污染默认值)

    // 加载本地存储（如果有的话覆盖默认值）
    try {
        const saved = localStorage.getItem('products')
        if (saved) products.value = JSON.parse(saved)
    } catch (e) {
        console.warn('localStorage 数据损坏，使用默认数据', e)
    }

    // 搜索/筛选/排序/分页状态（视图 UI 用）
    // 搜索关键词：用于商品名称搜索。
    const searchKeyword = ref('')
    // 当前选中的分类：'' 表示全部分类。
    const selectedCategory = ref('')         // '' = 全部分类
    // 排序方向：'asc' 表示升序，'desc' 表示降序。
    const sortDir = ref('asc')               // 'asc' 升序 / 'desc' 降序
    // 当前页码：用于分页展示。
    const currentPage = ref(1)
    // 每页显示数量：固定为 10。
    const pageSize = 10

    // 勾选状态（数组版本：数组的 .push/.splice 能触发响应式，Set 不行）
    // 已勾选的商品 ID 列表，用于批量删除与全选状态判断。
    const selectedIds = ref([])

    // 弹窗状态
    // 正在编辑的商品 ID：null 表示新增模式。
    const editingId = ref(null)              // null = 新增模式
    // 单条删除时的商品 ID：null 表示非单删模式。
    const deleteId = ref(null)               // null = 非单删模式
    // 是否显示新增/编辑商品弹窗。
    const showProductModal = ref(false)      // 控制新增/编辑弹窗
    // 是否显示删除确认弹窗。
    const showDeleteModal = ref(false)       // 控制删除确认弹窗

    // Toast 提示文本（空字符串 = 不显示）
    // 当前要展示的提示消息。
    const toastMsg = ref('')
    // Toast 定时器，用于自动清除提示。
    let toastTimer = null

    // ==========================================================
    // ===== 2. getters（派生数据）=====
    // computed 自动缓存：依赖没变就不重算
    // ==========================================================

    // 过滤后的商品（搜索 + 分类）
    const filteredProducts = computed(() => {
        const kw = searchKeyword.value
        const cat = selectedCategory.value
        return products.value.filter(p =>
            p.name.includes(kw) && (cat === '' ? true : p.category === cat)
        )
    })

    // 排序后的商品（价格升降）
    const sortedProducts = computed(() => {
        return [...filteredProducts.value].sort((a, b) =>
            sortDir.value === 'asc' ? a.price - b.price : b.price - a.price
        )
    })

    // 总页数（最少 1，防止空数据时翻出 0 页）
    const totalPages = computed(() =>
        Math.max(1, Math.ceil(sortedProducts.value.length / pageSize))
    )

    // 当前页数据（page 越界时自动夹紧）
    const pagedProducts = computed(() => {
        let p = currentPage.value
        if (p > totalPages.value) p = totalPages.value
        if (p < 1) p = 1
        return sortedProducts.value.slice((p - 1) * pageSize, p * pageSize)
    })

    // 统计卡片用
    const stats = computed(() => ({
        total: products.value.length,
        online: products.value.filter(p => p.status === '上架中').length,
        offline: products.value.filter(p => p.status === '已下架').length,
        stock: products.value.reduce((s, p) => s + Number(p.stock), 0),
    }))

    // 图表用：每个分类的总库存 { 电子产品: 731, 服装: 990, ... }
    const categoryStock = computed(() => {
        const map = {}
        products.value.forEach(p => {
            map[p.category] = (map[p.category] || 0) + Number(p.stock)
        })
        return map
    })

    // 当前页 id 列表（用于全选三态判断）
    const pageIds = computed(() => pagedProducts.value.map(p => p.id))
    const checkedCount = computed(() =>
        pageIds.value.filter(id => selectedIds.value.includes(id)).length
    )

    // 全选框三态
    const checkAllState = computed(() => {
        const total = pageIds.value.length
        const checked = checkedCount.value
        if (total === 0 || checked === 0) return 'none'        // 空 / 全不勾
        if (checked === total) return 'all'                    // 全勾
        return 'partial'                                       // 部分勾（横杠）
    })

    // ==========================================================
    // ===== 3. actions（业务方法）=====
    // ==========================================================

    // 设置搜索关键词，并重置到第一页。
    function setSearchKeyword(kw) {
        searchKeyword.value = kw
        currentPage.value = 1
    }

    // 切换分类，并重置到第一页。
    function setCategory(cat) {
        selectedCategory.value = cat
        currentPage.value = 1
    }

    // 切换排序方向：升序/降序互换。
    function toggleSort() {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
        currentPage.value = 1
    }

    // 直接设置排序方向。
    function setSortDir(dir) {
        sortDir.value = dir
        currentPage.value = 1
    }

    // 翻页（带边界保护，确保页码不越界）。
    function goToPage(p) {
        currentPage.value = Math.max(1, Math.min(totalPages.value, p))
    }

    // 勾选/取消勾选单行商品。
    function toggleSelect(id) {
        const i = selectedIds.value.indexOf(id)
        if (i >= 0) selectedIds.value.splice(i, 1)
        else selectedIds.value.push(id)
    }

    // 点击全选框时，切换当前页的全选/取消状态。
    function toggleCheckAll() {
        if (checkAllState.value === 'all') {
            // 当前页全勾 → 取消当前页
            selectedIds.value = selectedIds.value.filter(id => !pageIds.value.includes(id))
        } else {
            // 当前页未全勾 → 把当前页全部加进去（去重保留其他页的）
            const set = new Set([...selectedIds.value, ...pageIds.value])
            selectedIds.value = [...set]
        }
    }

    // 清空已选列表。
    function clearSelected() {
        selectedIds.value = []
    }

    // ========== CRUD ==========
    // 新增商品：生成新的商品对象并追加到列表末尾。
    function addProduct(data) {
        products.value.push({
            id: Date.now(),   // 用时间戳当 id，简单可靠
            ...data,
        })
    }

    // 根据 ID 更新商品信息。
    function updateProduct(id, data) {
        const p = products.value.find(x => x.id === id)
        if (p) Object.assign(p, data)
    }

    // 删除单个商品。
    function deleteSingle(id) {
        products.value = products.value.filter(p => p.id !== id)
    }

    // 批量删除多个商品。
    function deleteBatch(ids) {
        const set = new Set(ids)
        products.value = products.value.filter(p => !set.has(p.id))
        clearSelected()
    }

    // ========== 弹窗控制 ==========
    // 打开新增商品弹窗。
    function openAddModal() {
        editingId.value = null
        showProductModal.value = true
    }

    // 打开编辑商品弹窗，并绑定当前商品 ID。
    function openEditModal(id) {
        editingId.value = id
        showProductModal.value = true
    }

    // 关闭新增/编辑商品弹窗。
    function closeProductModal() {
        showProductModal.value = false
        editingId.value = null
    }

    // 打开单条删除确认弹窗。
    function openDeleteSingle(id) {
        deleteId.value = id
        selectedIds.value = []
        showDeleteModal.value = true
    }

    // 打开批量删除确认弹窗。
    function openDeleteBatch() {
        if (selectedIds.value.length === 0) return
        deleteId.value = null
        showDeleteModal.value = true
    }

    // 关闭删除确认弹窗。
    function closeDeleteModal() {
        showDeleteModal.value = false
        deleteId.value = null
    }

    // 确认删除：优先执行批量删除，否则执行单条删除。
    function confirmDelete() {
        if (selectedIds.value.length > 0) {
            deleteBatch(selectedIds.value)
        } else if (deleteId.value !== null) {
            deleteSingle(deleteId.value)
        }
        closeDeleteModal()
        showToast('删除成功')
    }

    // ========== Toast 提示 ==========
    // 显示提示消息，并在指定时间后自动隐藏。
    function showToast(msg, duration = 2000) {
        toastMsg.value = msg
        if (toastTimer) clearTimeout(toastTimer)
        toastTimer = setTimeout(() => { toastMsg.value = '' }, duration)
    }

    // ========== 持久化 ==========
    // watch 深度监听 products 数组，只要任何字段变了就写 localStorage
    watch(products, () => {
        localStorage.setItem('products', JSON.stringify(products.value))
    }, { deep: true })

    // ==========================================================
    // 返回暴露给组件的部分
    // ==========================================================
    return {
        // state
        products, searchKeyword, selectedCategory, sortDir, currentPage, pageSize,
        selectedIds, editingId, deleteId,
        showProductModal, showDeleteModal, toastMsg,

        // getters
        filteredProducts, sortedProducts, totalPages, pagedProducts,
        stats, categoryStock, pageIds, checkedCount, checkAllState,

        // actions
        setSearchKeyword, setCategory, toggleSort, goToPage,
        toggleSelect, setSortDir, toggleCheckAll, clearSelected,
        addProduct, updateProduct, deleteSingle, deleteBatch,
        openAddModal, openEditModal, closeProductModal,
        openDeleteSingle, openDeleteBatch, closeDeleteModal, confirmDelete,
        showToast,
    }
})