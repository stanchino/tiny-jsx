import { state, getHookState, argsChanged } from './core';

let pendingEffects = [];

function invokeCleanup(hook) {
  typeof hook.__cleanup === 'function' && hook.__cleanup();
}

function invokeEffect(hook) {
  const result = hook.__value();
  typeof result === 'function' && (hook.__cleanup = result);
}

function handleEffects(effects) {
  effects.forEach(invokeCleanup);
  effects.forEach(invokeEffect);
  return [];
}

function flushEffects() {
  pendingEffects.forEach(vNode => {
    vNode.__effectsQueued = false;
    vNode.__effects = handleEffects(vNode.__effects);
  });
  pendingEffects = [];
}

function afterRender (vNode) {
  if (!vNode.__effectsQueued && (vNode.__effectsQueued = true) && pendingEffects.push(vNode) === 1) {
    if (typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(flushEffects);
    } else {
      setTimeout(flushEffects);
    }
  }
}

function useEffect(callback, args) {
  const hookState = getHookState(state.index++);
  if (argsChanged(hookState.__args, args)) {
    hookState.__value = callback;
    hookState.__args = args;

    state.vNode.__effects.push(hookState);
    if (typeof window !== 'undefined') afterRender(state.vNode);
  }
}

export default useEffect;
