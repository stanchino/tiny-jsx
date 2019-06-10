import useReducer from './useReducer';
import { invokeOrReturn } from './core';

export default function useState(initialState) {
  return useReducer(invokeOrReturn, initialState);
}
