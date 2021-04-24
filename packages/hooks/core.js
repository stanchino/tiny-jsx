const state = {
  index: 0,
  vNode: undefined,
};

function getHookState(index) {
  typeof state.vNode.__effects === 'undefined' && (state.vNode.__effects = []);
  const hooks = state.vNode.__hooks || (state.vNode.__hooks = []);

  if (index >= hooks.length) {
    hooks.push({});
  }
  return hooks[index];
}

function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

function invokeOrReturn(arg, f) {
  return typeof f === 'function' ? f(arg) : f;
}

export { state, getHookState, argsChanged, invokeOrReturn };
