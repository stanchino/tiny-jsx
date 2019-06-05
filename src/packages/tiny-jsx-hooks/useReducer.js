import currentHook, { invokeOrReturn, getHookState } from './shared';

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
          currentHook.emitter.emit('render', hookState._component);
        }
      }
    ];
  }

  return hookState._value;
}
