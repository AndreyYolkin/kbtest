<script setup lang="ts">
import { useKanbanStore } from '../stores/kanbanStore'
import { computed } from 'vue'
import type { Task } from '../types/kanban';

const props = defineProps<{
  task: Task
}>()

const store = useKanbanStore()

const trackName = computed(() => {
  const track = store.tracks.find(t => t.id === props.task.trackId)
  return track ? track.name : props.task.trackId
})
</script>

<template>
  <div class="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-750 hover:border-gray-600 transition-all group relative">
    <div class="flex justify-between items-center mb-2">
      <span
        class="text-[10px] font-bold px-1.5 py-0.5 rounded border"
        :class="{
          'bg-red-500/10 text-red-400 border-red-500/20': task.trackId === 'bug',
          'bg-blue-500/10 text-blue-400 border-blue-500/20': task.trackId === 'feature'
        }"
      >
        {{ trackName }}
      </span>
      <span class="text-[10px] text-gray-500 font-mono">#{{ task.id }}</span>
    </div>
    <h3 class="text-gray-200 font-medium text-sm mb-1 leading-snug group-hover:text-blue-400 transition-colors">{{ task.title }}</h3>
    <p class="text-gray-500 text-xs line-clamp-2 leading-relaxed">{{ task.description }}</p>
  </div>
</template>
