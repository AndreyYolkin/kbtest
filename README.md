# Smart Kanban Board

A Vue 3 + Pinia + UnoCSS Kanban board with smart drag-and-drop logic based on task tracks and status workflows.

## Features

- **Vue 3** (Composition API, `<script setup>`)
- **Pinia** for state management
- **UnoCSS** (`presetWind4`) for styling
- **H3 Server** for backend logic (in-memory database)
- **Smart Drag & Drop**:
  - Validates transitions based on task track (Bug vs Feature).
  - Highlights valid drop zones.
  - Shows error message for invalid columns (e.g., "Needs Attention").
- **Dark Mode** UI.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the backend server (running on port 3000):
    ```bash
    npm run server
    ```

3.  Start the frontend development server (in a new terminal):
    ```bash
    npm run dev
    ```

## Project Structure

- `server.ts`: H3 server with in-memory database and workflow logic.
- `src/stores/kanbanStore.ts`: Pinia store handling state and API calls.
- `src/components/`:
  - `KanbanBoard.vue`: Main board layout.
  - `KanbanColumn.vue`: Renders status zones and handles drop logic.
  - `TaskCard.vue`: Draggable task component.
