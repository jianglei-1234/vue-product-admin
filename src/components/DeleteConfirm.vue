<script setup>
// ============================================================
// DeleteConfirm 组件：删除确认弹窗
// 两种模式共用：
//   - selectedIds.length > 0：批量删除
//   - deleteId !== null：单个删除
// ============================================================
import { computed } from 'vue'
import { useProductStore } from '../stores/product'
import { storeToRefs } from 'pinia'

const store = useProductStore()
const { showDeleteModal, selectedIds, deleteId } = storeToRefs(store)

// 弹窗文案（动态显示数量）
const message = computed(() => {
    if (selectedIds.value.length > 0) {
        return `确定删除选中的 ${selectedIds.value.length} 件商品吗？删除后不可恢复。`
    }
    return '删除后不可恢复，请确认是否删除？'
})
</script>

<template>
  <div
    v-if="showDeleteModal"
    class="overlay"
    @click.self="store.closeDeleteModal()"
  >
    <div class="modal">
      <h3>确认删除？</h3>
      <p>{{ message }}</p>
      <div class="buttons">
        <button class="btn-danger" @click="store.confirmDelete()">确认</button>
        <button class="btn-default" @click="store.closeDeleteModal()">取消</button>
      </div>
    </div>
  </div>
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
  width: min(100%, 380px);
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
  box-shadow: 0 20px 45px rgba(15, 23, 42, .2);
}
.modal h3 {
  margin-bottom: 16px;
  color: var(--text-main);
  font-size: 18px;
}
.modal p {
  color: var(--text-sub);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>