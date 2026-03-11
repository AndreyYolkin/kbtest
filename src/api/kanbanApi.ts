import apiClient from './client'
import type { Task, Status, Column, Track } from '../types/kanban'

type MoveTaskResponse = Task | { error: string, validTransitions: string[] }

export const kanbanApi = {
  getColumns() {
    return apiClient.get<Column[]>('/columns')
  },
  
  getStatuses() {
    return apiClient.get<Status[]>('/statuses')
  },
  
  getTracks() {
    return apiClient.get<Track[]>('/tracks')
  },
  
  getTasks() {
    return apiClient.get<Task[]>('/tasks')
  },
  
  moveTask(taskId: number, newStatusId: string) {
    return apiClient.post<MoveTaskResponse>('/tasks/move', { taskId, newStatusId })
  },
  
  getTransitions(trackId: string, currentStatus: string) {
    return apiClient.get<string[]>('/transitions', {
      params: { trackId, currentStatus }
    })
  }
}
