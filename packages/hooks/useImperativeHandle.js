import { state, getHookState, argsChanged } from './core';

function useImperativeHandle(ref, createHandle, args) {
  const hookState = getHookState(state.index++);
  if (argsChanged(hookState.__args, args)) {
    hookState.__args = args;
    if (ref) {
      ref.current = createHandle();
    }
  }
}

export default useImperativeHandle;
