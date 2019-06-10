import { state, getHookState } from './core';

export default function useRef(initialValue) {
  const hookState = getHookState(state.index++);
  if (!hookState.__value) {
    hookState.__value = { current: initialValue };
  }

  return hookState.__value;
}
