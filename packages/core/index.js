import { emitter } from '../emitter';

function convert(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return { type: 'text', props: {}, __value: String(value) };
  }
  return value;
}

function buildChildren(children) {
  if (typeof children === 'undefined' || children === null) return [];
  return Array.isArray(children) ? children.map(convert) : [convert(children)];
}

export function createElement(type, props, children) {
  props = Object.assign({}, props);

  props.children = buildChildren(children);
  if (arguments.length > 3) {
    for (let i = 3; i < arguments.length; i++) {
      props.children.push(convert(arguments[i]));
    }
  }

  if (typeof type === 'function') {
    const fn = { type: 'function', props, __effects: [], __hooks: [] };
    fn.__callback = function () {
      emitter.emit('construct', fn);
      fn.props.children = buildChildren(type(props));
    };
    return fn;
  } else if (typeof type === 'object') {
    return Object.assign({}, type, { props });
  }

  return { type, props };
}

export function createRef() {
  return {};
}

export function createContext() {
  let ctx = {};
  return {
    Consumer(props) {
      return (Array.isArray(props.children) ? props.children[0] : props.children)(ctx);
    },
    Provider(props) {
      ctx = props.value;
      return props.children;
    },
  };
}

export const Fragment = {
  type: 'fragment',
};

export default {
  createElement,
  createContext,
  Fragment,
};
