# Task Manager — React Native

A simple task manager app: add tasks, view them in a list, delete them, and have them persist across app restarts via `AsyncStorage`.

## Requirements → Where They're Implemented

| # | Requirement | File |
|---|---|---|
| 1 | Task interface | `types/Task.ts` |
| 2 | Task state | `App.tsx` — `useState<Task[]>` |
| 3 | Add a task | `components/TaskInput.tsx` + `App.tsx` — `handleAddTask` |
| 4 | Display tasks | `components/TaskList.tsx` — `FlatList` |
| 5 | Delete tasks | `components/TaskItem.tsx` (button) + `App.tsx` — `handleDeleteTask` |
| 6 | Handle an empty list | `components/EmptyState.tsx`, conditionally rendered in `TaskList.tsx` |
| 7 | Save tasks | `utils/taskStorage.ts` — `saveTasks()`, called from a `useEffect` in `App.tsx` |
| 8 | Load tasks | `utils/taskStorage.ts` — `loadTasks()`, called from a `useEffect` in `App.tsx` |

## Project Structure

```
TaskManagerApp/
├── App.tsx                    # Main screen: state, load/save effects, add/delete handlers
├── types/
│   └── Task.ts                # Task interface
├── utils/
│   └── taskStorage.ts         # AsyncStorage save/load helpers
└── components/
    ├── TaskInput.tsx          # Text input + "Add" button
    ├── TaskList.tsx           # FlatList of tasks, or EmptyState if none
    ├── TaskItem.tsx           # A single task row with a "Delete" button
    └── EmptyState.tsx         # "No tasks yet" message
```

## How Data Flows

1. On mount, `App.tsx` calls `loadTasks()` and puts the result into state.
2. Typing in `TaskInput` and pressing **Add** calls `onAddTask`, which `App.tsx` uses to build a new `Task` object and prepend it to state.
3. Every time `tasks` changes, a `useEffect` in `App.tsx` calls `saveTasks(tasks)` to persist the updated list.
4. `TaskList` renders each task via `TaskItem`. Tapping **Delete** on a row calls `onDelete(id)`, which filters that task out of state — triggering the same save effect.
5. If `tasks` is empty (on first launch, or after deleting everything), `TaskList` renders `EmptyState` instead of an empty `FlatList`.
