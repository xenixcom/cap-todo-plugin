window.__todoHook__ = {
  async echo(options) {
    const result = await capacitorTodo.Todo.echo(options);
    return { value: `${result.value}-fault` };
  },

  async getStatus() {
    return { status: "running" };
  },

  async getOptions() {
    const result = await capacitorTodo.Todo.getOptions();
    return {
      ...result,
      debug: false,
      enabled: false,
    };
  },

  async setOptions(options) {
    return capacitorTodo.Todo.setOptions(options);
  },

  async resetOptions() {
    return capacitorTodo.Todo.resetOptions();
  },
};
