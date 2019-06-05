import currentHook, { getHookState } from "./shared";

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
