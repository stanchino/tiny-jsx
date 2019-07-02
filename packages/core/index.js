import { emitter } from '../emitter';

const Fragment = {
  type: 'fragment',
};

function convert(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return { type: 'text', props: {}, __value: String(value) };
  }
  return value;
}

function buildChildren(children) {
  if (typeof children === 'undefined' || children === null || children === false) return [];
  return (Array.isArray(children) ? children.map(convert) : [convert(children)]);
}

function unmount(vNode) {
  if (vNode.type !== 'fragment') return;
  typeof vNode.__cleanup === 'function' && vNode.__cleanup();
  vNode.props.children && vNode.props.children.forEach(unmount);
}

function createElement(type, props, children) {
  props = Object.assign({}, props );

  props.children = buildChildren(children);
  if (arguments.length > 3) {
    for (let i = 3; i < arguments.length; i++) {
      props.children.push(convert(arguments[i]));
    }
  }


  if (typeof type === 'function') {
    const fn = { type: 'fragment', props, __effects: [], __hooks: [] };
    fn.__mount = function () {
      emitter.emit('mount', fn);
      fn.props.children = buildChildren(type(props));
    };
    fn.__cleanup = function() {
      fn.__hooks.forEach(function(hook) {
        typeof hook.__cleanup === 'function' && hook.__cleanup();
      });
    };
    fn.__unmount = function() {
      unmount(fn);
    };
    return fn;
  } else if (typeof type === 'object') {
    return Object.assign({}, type, { props });
  }

  return { type, props };
}

function createRef() {
  return {};
}

function createContext() {
  let ctx = {};
  return {
    Consumer(props) {
      if (typeof props === 'function') return props(ctx);
      if (Array.isArray(props.children) && typeof props.children[0] === 'function') return props.children[0](ctx);
      throw new Error('Unsupported context consumer');
    },
    Provider(props) {
      ctx = props.value;
      return props.children;
    },
  };
}

export { createElement, createRef, createContext, Fragment };
export default {
  createElement,
  createRef,
  createContext,
  Fragment,
};
