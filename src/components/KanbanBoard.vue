<script setup lang="ts">
import { onMounted } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'
import KanbanColumn from './KanbanColumn.vue'

const store = useKanbanStore()

onMounted(() => {
  store.fetchBoardData()
})
</script>

<template>
  <div class="h-screen bg-gray-950 p-8 overflow-hidden flex flex-col">
    <header class="mb-8 flex items-center justify-between">
      <h1 class="text-3xl font-bold text-white tracking-tight">
        Smart <span class="text-blue-500">Kanban</span>
      </h1>
      <div class="flex gap-4 text-sm text-gray-400">
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-red-900"></span> Bug
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3 h-3 rounded-full bg-blue-900"></span> Feature
        </div>
      </div>
    </header>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 flex-1 min-h-0">
      <KanbanColumn
        v-for="column in store.columns"
        :key="column.id"
        :column="column"
      />
    </div>
  </div>
</template>
