<script setup>
// ============================================================
// ProductModal 组件：新增/编辑商品弹窗（同一个弹窗两种模式）
// editingId === null → 新增模式
// editingId !== null → 编辑模式
// ============================================================
import { ref, watch, computed } from 'vue'
import { useProductStore } from '../stores/product'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const { showProductModal, editingId, products } = storeToRefs(store)

// 表单字段
const form = ref({
    name: '',
    category: '电子产品',
    price: 0,
    stock: 0,
    status: '上架中',
})

// 当前编辑的商品数据
const editingProduct = computed(() =>
    editingId.value !== null
        ? products.value.find(p => p.id === editingId.value)
        : null
)

// 弹窗打开时回填数据
watch(showProductModal, (show) => {
    if (show) {
        if (editingProduct.value) {
            // 编辑模式：回填原数据
            form.value = {
                name: editingProduct.value.name,
                category: editingProduct.value.category,
                price: editingProduct.value.price,
                stock: editingProduct.value.stock,
                status: editingProduct.value.status,
            }
        } else {
            // 新增模式：清空
            form.value = {
                name: '',	
                category: '电子产品',
                price: 0,
                stock: 0,
                status: '上架中',
            }
        }
    }
})

function save() {
    // 简单校验
    if (!form.value.name.trim()) {
        store.showToast('商品名称不能为空')
        return
    }
    if (form.value.price < 0 || form.value.stock < 0) {
        store.showToast('价格和库存不能为负数')
        return
    }

    if (editingId.value !== null) {
        store.updateProduct(editingId.value, { ...form.value })
        store.showToast('商品编辑成功')
    } else {
        store.addProduct({ ...form.value })
        store.showToast('商品添加成功')
    }
    store.closeProductModal()
}
</script>

<template>
  <!-- 弹窗过渡（新增）：Transition 包住 overlay，遮罩淡入 + 弹窗缩放 -->
  <Transition name="modal">
    <div
      v-if="showProductModal"
      class="overlay"
      @click.self="store.closeProductModal()"
    >
    <div class="modal">
      <h3>{{ editingId === null ? '新增商品' : '编辑商品' }}</h3>

      <label>
        <span>名称：</span>
        <input v-model="form.name" type="text" class="m-input">
      </label>

      <label>
        <span>分类：</span>
        <select v-model="form.category" class="m-input">
          <option value="电子产品">电子产品</option>
          <option value="服装">服装</option>
          <option value="家居">家居</option>
          <option value="食品">食品</option>
        </select>
      </label>

      <label>
        <span>价格：</span>
        <input v-model.number="form.price" type="number" class="m-input">
      </label>

      <label>
        <span>库存：</span>
        <input v-model.number="form.stock" type="number" class="m-input">
      </label>

      <label>
        <span>状态：</span>
        <select v-model="form.status" class="m-input">
          <option value="上架中">上架中</option>
          <option value="已下架">已下架</option>
        </select>
      </label>

      <div class="modal-buttons">
        <button class="btn-primary" @click="save">保存</button>
        <button class="btn-default" @click="store.closeProductModal()">取消</button>
      </div>
    </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, .5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  width: min(100%, 440px);
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
  box-shadow: 0 20px 45px rgba(15, 23, 42, .2);
}
.modal h3 {
  margin-bottom: 20px;
  color: var(--text-main);
  font-size: 20px;
}

.modal label {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  color: var(--text-main);
  font-size: 14px;
}

.m-input {
  width: 100%;
  height: 38px;
  padding: 0 10px;
  border: 1px solid var(--border);      /* 原来写死 #d1d5db，改用变量以适配暗黑主题 */
  border-radius: 6px;
  background: var(--bg-card);           /* 原来写死 #fff，改用变量以适配暗黑主题 */
  color: var(--text-main);
  font: inherit;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.m-input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .15);
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* ===== 弹窗过渡（新增）：遮罩淡入 + 弹窗从 92% 缩放弹起 ===== */
/* 外层 .overlay 管透明度，内层 .modal 管 transform，两个一起动 */
.modal-enter-active,
.modal-leave-active { transition: opacity .22s ease; }
.modal-enter-active .modal,
.modal-leave-active .modal { transition: transform .22s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }
.modal-enter-from .modal,
.modal-leave-to .modal { transform: scale(.92); }
</style>