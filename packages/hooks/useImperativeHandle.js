import { state, getHookState, argsChanged } from './core';

export default function useImperativeHandle(ref, createHandle, args) {
  const hookState = getHookState(state.index++);
  if (argsChanged(hookState.__args, args)) {
    hookState.__args = args;
    if (ref) {
      ref.current = createHandle();
    }
  }
}
