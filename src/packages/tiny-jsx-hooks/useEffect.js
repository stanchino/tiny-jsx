import currentHook, { argsChanged, getHookState } from './shared';

let afterPaintEffects = [];

function afterPaint (vNode) {
  if (!vNode._afterPaintQueued && (vNode._afterPaintQueued = true) && afterPaintEffects.push(vNode) === 1) {
    if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
      window.requestAnimationFrame(scheduleFlushAfterPaint);
    }
  }
}

function handleEffects(effects) {
  effects.forEach(invokeCleanup);
  effects.forEach(invokeEffect);
  return [];
}

function invokeCleanup(hook) {
  if (hook._cleanup) hook._cleanup();
}

function invokeEffect(hook) {
  const result = hook._value();
  if (typeof result === 'function') hook._cleanup = result;
}

function flushAfterPaintEffects() {
  afterPaintEffects.some(vNode => {
    vNode._afterPaintQueued = false;
    if (vNode.__parentDOMNode && vNode.__DOMNode) {
      vNode.__hooks._pendingEffects = handleEffects(vNode.__hooks._pendingEffects);
    }
  });
  afterPaintEffects = [];
}

function scheduleFlushAfterPaint() {
  setTimeout(flushAfterPaintEffects);
}

export function useEffect(callback, args) {
  const hookState = getHookState(currentHook.index++);
  if (argsChanged(hookState._args, args)) {
    hookState._value = callback;
    hookState._args = args;

    currentHook.vNode.__hooks._pendingEffects.push(hookState);
    afterPaint(currentHook.vNode);
  }
}
