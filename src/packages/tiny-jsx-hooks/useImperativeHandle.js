import currentHook, { argsChanged, getHookState } from './shared';

export function useImperativeHandle(ref, createHandle, args) {
  const state = getHookState(currentHook.index++);
  if (argsChanged(state._args, args)) {
    state._args = args;
    if (ref) {
      ref.current = createHandle();
    }
  }
}
