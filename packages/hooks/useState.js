import useReducer from './useReducer';
import { invokeOrReturn } from './core';

function useState(initialState) {
  return useReducer(invokeOrReturn, initialState);
}

export default useState;
