import { invokeOrReturn } from './shared';
import { useReducer } from './useReducer';

export function useState(initialState) {
  return useReducer(invokeOrReturn, initialState);
}
