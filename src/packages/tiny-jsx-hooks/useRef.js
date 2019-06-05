import currentHook, { getHookState } from './shared';

export function useRef(initialValue) {
  const state = getHookState(currentHook.index++);
  if (!state._value) {
    state._value = { current: initialValue };
  }

  return state._value;
}
