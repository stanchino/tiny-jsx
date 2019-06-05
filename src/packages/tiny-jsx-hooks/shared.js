import emitter from '../tiny-jsx-emitter';

const currentHook = {
  index: 0,
  vNode: undefined,
  emitter,
};

export function getHookState(index) {
  const hooks = currentHook.vNode.__hooks || (currentHook.vNode.__hooks = { _list: [], _pendingEffects: [], _pendingLayoutEffects: [] });

  if (index >= hooks._list.length) {
    hooks._list.push({});
  }
  return hooks._list[index];
}

export function invokeOrReturn(arg, f) {
  return typeof f === 'function' ? f(arg) : f;
}

export function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

emitter.on('construct', function(vNode) {
  currentHook.index = 0;
  currentHook.vNode = vNode;
});

export default currentHook;
