import { state, getHookState, argsChanged } from './core';

export default function useMemo(callback, args) {
  const hookState = getHookState(state.index++);
  if (argsChanged(hookState.__args, args)) {
    hookState.__args = args;
    hookState.__callback = callback;
    return hookState.__value = callback();
  }

  return hookState.__value;
}
