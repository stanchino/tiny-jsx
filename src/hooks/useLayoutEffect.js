import { state, getHookState, argsChanged } from './core';

function useLayoutEffect(callback, args) {
  const hookState = getHookState(state.index++);
  if (argsChanged(hookState.__args, args)) {
    hookState.__value = callback;
    hookState.__args = args;

    state.vNode.__effects.push(hookState);
  }
}

export default useLayoutEffect;
