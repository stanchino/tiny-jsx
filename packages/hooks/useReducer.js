import { emitter, state, getHookState, invokeOrReturn } from './core';

function useReducer(reducer, initialState, init) {
  const hookState = getHookState(state.index++);
  if (!hookState.__vNode) {
    hookState.__vNode = state.vNode;

    hookState.__value = [
      !init ? invokeOrReturn(null, initialState) : init(initialState),

      action => {
        const nextValue = reducer(hookState.__value[0], action);
        if (hookState.__value[0] !== nextValue) {
          hookState.__value[0] = nextValue;
          emitter.emit('render', hookState.__vNode);
        }
      }
    ];
  }

  return hookState.__value;
}

export default useReducer;
