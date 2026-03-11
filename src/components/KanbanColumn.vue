<script setup lang="ts">
import { computed } from 'vue'
import { useKanbanStore } from '../stores/kanbanStore'
import TaskCard from './TaskCard.vue'
import type { Column } from '../types/kanban';

const props = defineProps<{
  column: Column
}>()

const store = useKanbanStore()

// Get all tasks that belong to this column (regardless of specific status)
const columnTasks = computed(() => {
  // Find all statuses that belong to this column
  const statusIds = store.statuses
    .filter(s => s.columnId === props.column.id)
    .map(s => s.id)
  
  // Filter tasks that have one of these statuses
  return store.tasks.filter(task => statusIds.includes(task.statusId))
})
</script>

<template>
  <div class="flex flex-col h-full rounded-xl bg-gray-900/50 border border-gray-800/50 overflow-hidden relative">
    <!-- Column Header -->
    <div class="p-4 border-b border-gray-800 flex items-center justify-between bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10">
      <h2 class="text-lg font-bold text-gray-100">{{ column.title }}</h2>
      <div class="flex gap-1">
        <span class="bg-gray-800 text-gray-400 text-xs px-2 py-1 rounded-full">
          {{ columnTasks.length }}
        </span>
      </div>
    </div>

    <!-- Task List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 custom-scrollbar">
      <TaskCard
        v-for="task in columnTasks"
        :key="task.id"
        :task="task"
      />
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>
