import { state, getHookState } from './core';

export default function useContext(context) {
  const provider = state.vNode.context[context.__id];
  if (!provider) return context.__defaultValue;
  const hookState = getHookState(state.index++);
  if (hookState.__value == null) {
    hookState.__value = true;
    provider.sub(state.vNode);
  }
  return provider.props.value;
}
