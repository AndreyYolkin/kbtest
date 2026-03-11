import { defineStore } from 'pinia'
import { ref } from 'vue'
import { kanbanApi } from '../api/kanbanApi'
import type { Task, Status, Column, Track } from '../types/kanban'

export const useKanbanStore = defineStore('kanban', () => {
  const tracks = ref<Track[]>([])
  const statuses = ref<Status[]>([])
  const columns = ref<Column[]>([])
  const tasks = ref<Task[]>([])

  const fetchBoardData = async () => {
    try {
      const [columnsRes, statusesRes, tracksRes, tasksRes] = await Promise.all([
        kanbanApi.getColumns(),
        kanbanApi.getStatuses(),
        kanbanApi.getTracks(),
        kanbanApi.getTasks()
      ])
      
      columns.value = columnsRes
      statuses.value = statusesRes
      tracks.value = tracksRes
      tasks.value = tasksRes
    } catch (error) {
      console.error('Failed to fetch board data:', error)
    }
  }

  const moveTask = async (taskId: number, newStatusId: string) => {
    try {
      const result = await kanbanApi.moveTask(taskId, newStatusId)
      if ('error' in result) {
        return
      }
      const task = tasks.value.find(item => item.id === taskId)
      if (!task) {
        return
      }
      task.statusId = result.statusId
    } catch (error) {
      console.error('Failed to move task:', error)
    }
  }

  return {
    tracks,
    statuses,
    columns,
    tasks,
    fetchBoardData,
    moveTask
  }
})
