import { state, getHookState } from './core';

export default function useContext(context) {
  const hookState = getHookState(state.index++);
  if (hookState.__value == null) {
    hookState.__value = context.value;
  }
  return hookState.__value;
}
