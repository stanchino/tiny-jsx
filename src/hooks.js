import { emitter } from './emitter';

const currentHook = {
  index: 0,
  vNode: undefined,
};

let afterPaintEffects = [];

emitter.on('construct', function(vNode) {
  currentHook.index = 0;
  currentHook.vNode = vNode;
});

function getHookState(index) {
  const hooks = currentHook.vNode.__hooks || (currentHook.vNode.__hooks = { _list: [], _pendingEffects: [], _pendingLayoutEffects: [] });

  if (index >= hooks._list.length) {
    hooks._list.push({});
  }
  return hooks._list[index];
}

function invokeOrReturn(arg, f) {
  return typeof f === 'function' ? f(arg) : f;
}

function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

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

export function useCallback(callback, args) {
  return useMemo(() => callback, args);
}

export function useContext(context) {
  const provider = currentHook.vNode.context[context._id];
  if (!provider) return context._defaultValue;
  const state = getHookState(currentHook.index++);
  if (state._value == null) {
    state._value = true;
    provider.sub(currentHook.vNode);
  }
  return provider.props.value;
}

export function useDebugValue(value, formatter) {
  return formatter ? formatter(value) : value;
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

export function useImperativeHandle(ref, createHandle, args) {
  const state = getHookState(currentHook.index++);
  if (argsChanged(state._args, args)) {
    state._args = args;
    if (ref) {
      ref.current = createHandle();
    }
  }
}

export function useMemo(callback, args) {
  const state = getHookState(currentHook.index++);
  if (argsChanged(state._args, args)) {
    state._args = args;
    state._callback = callback;
    return state._value = callback();
  }

  return state._value;
}

export function useReducer(reducer, initialState, init) {
  const hookState = getHookState(currentHook.index++);
  if (!hookState._component) {
    hookState._component = currentHook.vNode;

    hookState._value = [
      !init ? invokeOrReturn(null, initialState) : init(initialState),

      action => {
        const nextValue = reducer(hookState._value[0], action);
        if (hookState._value[0]!==nextValue) {
          hookState._value[0] = nextValue;
          emitter.emit('render', hookState._component);
        }
      }
    ];
  }

  return hookState._value;
}

export function useRef(initialValue) {
  const state = getHookState(currentHook.index++);
  if (!state._value) {
    state._value = { current: initialValue };
  }

  return state._value;
}

export function useState(initialState) {
  return useReducer(invokeOrReturn, initialState);
}
