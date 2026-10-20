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

# Task Manager — API Integration

The Task Manager app (local task list saved with `AsyncStorage`) now has a second screen, **Suggested Tasks**, that loads sample todos from a public API and lets the user add any of them to their own list.

## 1. API details

| | |
|---|---|
| **API** | [JSONPlaceholder](https://jsonplaceholder.typicode.com), a free fake REST API for prototyping |
| **Endpoint** | `GET https://jsonplaceholder.typicode.com/todos?_limit=20` |
| **Authentication** | None. No API key or secret is needed or stored. |
| **Data returned** | A JSON array of todo records |
| **How it supports the app** | The records have the same shape as a task (a title plus a done flag), so they work as "suggested tasks" a user can add to their list. |

Sample record:

```json
{ "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false }
```

Fields shown in the UI: `title`, `completed` (as an Open/Completed badge), `userId`, and `id`.

## 2. Requirements map

| # | Requirement | Where |
|---|---|---|
| 1 | API selection | This README, `services/todoApi.ts` |
| 2 | `fetch()` with `async/await` | `services/todoApi.ts` → `fetchSuggestedTodos()` |
| 3 | TypeScript type used in state | `types/ApiTodo.ts`; `useState<ApiTodo[]>` in `SuggestedTasksScreen.tsx` |
| 4 | 3+ fields per record | Title, status, user id, todo id on each card |
| 5 | Loading, error, empty, retry | `SuggestedTasksScreen.tsx` (spinner, error view with **Retry**, empty view with **Refresh**, pull-to-refresh) |
| 6 | Integration | Added as a second screen of the existing Task Manager; a header button navigates to it |
| 7 | Documentation | This file |
| 8 | Evidence | Screenshots of the success and error states (see the submission) |

## 3. Project structure

```
TaskManagerApp/
├── App.tsx                          # Stack navigator (Tasks, Suggested)
├── screens/
│   ├── TasksScreen.tsx              # Local task list (previously App.tsx)
│   └── SuggestedTasksScreen.tsx     # API-powered screen
├── services/
│   └── todoApi.ts                   # fetch() call and endpoint URL
├── types/
│   ├── Task.ts                      # Local task interface
│   ├── ApiTodo.ts                   # API record interface
│   └── navigation.ts                # Navigator param types
├── utils/
│   └── taskStorage.ts               # AsyncStorage helpers (+ addTaskToStorage)
└── components/                      # TaskInput, TaskList, TaskItem, EmptyState
```

## 4. Setup

```bash
npx create-expo-app TaskManagerApp --template blank-typescript
cd TaskManagerApp
npx expo install @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

Copy in the project files, then run `npx expo start` and open the app in Expo Go or a simulator. The device needs an internet connection for the first successful load.

## 5. Test steps

| Test | Steps | Expected result |
|---|---|---|
| Success | Open the app, tap **Suggestions** | A spinner appears briefly, then a list of 20 cards, each showing title, status badge, and user/todo ids |
| Error | Turn on airplane mode, then tap **Suggestions** (or pull to refresh) | The list is replaced by "Something went wrong" and a **Retry** button |
| Recovery | Turn airplane mode off, tap **Retry** | The spinner shows, then the list loads |
| HTTP error | In `todoApi.ts`, change `/todos` to `/todoss`, reload | Same error view (404 is caught by the `response.ok` check). Change it back afterward. |
| Empty | In `todoApi.ts`, change the URL to `.../todos?userId=999`, reload | "No suggestions right now" with a **Refresh** button. Change it back afterward. |
| Pull to refresh | On the list, pull down | The refresh indicator shows and the list reloads |
| Integration | Tap **Add to my tasks** on a card, then go back | The button reads "Added", and the task appears at the top of My Tasks |

## 6. Design decisions

- **JSONPlaceholder's `/todos`**: it needs no key, so there is nothing secret to protect, and its records map directly onto this app's task concept.
- **`response.ok` check**: `fetch()` only rejects on network failure, so HTTP errors like 404 or 500 would otherwise be treated as success. Throwing on `!response.ok` sends both kinds of failure to one `catch`.
- **Separate service file**: the URL and `fetch` call live in `services/todoApi.ts` so the screen only deals with state and UI, and swapping in a different API later touches one file.
- **One `loadTodos` function**: the first load, the Retry button, and pull-to-refresh all call it, so the loading and error behavior stays consistent.
- **`finally` block**: spinners are reset whether the request succeeds or fails, so the UI can't get stuck loading.
- **Friendly error text**: the screen shows a plain-language message, while the technical error goes to `console.error`.
- **Adding via storage**: the Suggested screen writes to `AsyncStorage` through `addTaskToStorage`, and the Tasks screen reloads on focus with `useFocusEffect`. This avoids sharing state through a context for a single interaction.
- **Limits of the API**: JSONPlaceholder is a fake API. Titles are placeholder text, and the data is read-only and identical for every user, so a production version would point at a real service.
