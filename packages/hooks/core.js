import { emitter } from '..';

export const state = {
  index: 0, // Hook iterator index
  vNode: undefined, // The constructed vNode
};

emitter.on('construct', function(vNode) {
  state.index = 0;
  state.vNode = vNode;
});

export function getHookState(index) {
  typeof state.vNode.__effects === 'undefined' && (state.vNode.__effects = []);
  const hooks = state.vNode.__hooks || (state.vNode.__hooks = []);

  if (index >= hooks.length) {
    hooks.push({});
  }
  return hooks[index];
}

export function argsChanged(oldArgs, newArgs) {
  return !oldArgs || newArgs.some((arg, index) => arg !== oldArgs[index]);
}

export function invokeOrReturn(arg, f) {
  return typeof f === 'function' ? f(arg) : f;
}

export { emitter };
