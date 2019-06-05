import currentHook, { argsChanged, getHookState } from './shared';


export function useMemo(callback, args) {
  const state = getHookState(currentHook.index++);
  if (argsChanged(state._args, args)) {
    state._args = args;
    state._callback = callback;
    return state._value = callback();
  }

  return state._value;
}
