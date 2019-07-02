import { state, getHookState, argsChanged } from './core';

function useMemo(callback, args) {
  const hookState = getHookState(state.index++);
  if (argsChanged(hookState.__args, args)) {
    hookState.__args = args;
    hookState.__callback = callback;
    return hookState.__value = callback();
  }

  return hookState.__value;
}

export default useMemo;
