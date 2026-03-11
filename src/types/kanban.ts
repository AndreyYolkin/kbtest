export interface Task {
  id: number
  title: string
  description: string
  trackId: string
  statusId: string
}

export interface Status {
  id: string
  title: string
  columnId: string
}

export interface Column {
  id: string
  title: string
}

export interface Track {
  id: string
  name: string
  transitions: Record<string, string[]>
}
