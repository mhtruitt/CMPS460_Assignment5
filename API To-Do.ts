// types/ApiTodo.ts
//
// REQUIREMENT 3 (TypeScript): the shape of one record returned by the
// JSONPlaceholder /todos endpoint. This type is used by the API service
// (return type) and by the screen's component state (useState<ApiTodo[]>).

export interface ApiTodo {
  userId: number; // which (fake) user the todo belongs to
  id: number; // unique id of the todo within the API
  title: string; // short text describing the todo
  completed: boolean; // whether the todo is marked done
}
