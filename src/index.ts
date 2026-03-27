import { registerPlugin } from '@capacitor/core';

import type { TodoPlugin } from './definitions';

const Todo = registerPlugin<TodoPlugin>('Todo', {
  web: () => import('./web').then((m) => new m.TodoWeb()),
});

export * from './definitions';
export { Todo };
