import { emitter } from '../emitter';

function convert(value) {
  if (typeof value === 'string' || typeof value === 'number') {
    return { type: 'text', props: {}, __value: String(value) };
  }
  return value;
}

export function createElement(type, props, children) {
  props = Object.assign({}, props);

  if (arguments.length > 3) {
    children = [children];
    for (let i = 3; i < arguments.length; i++) {
      children.push(arguments[i]);
    }
  }
  if (typeof children !== 'undefined') {
    if (Array.isArray(children)) {
      props.children = children.map(convert);
    } else {
      props.children = [convert(children)];
    }
  }

  if (typeof type === 'function') {
    const fragment = { type: 'fragment', props: {}, __effects: [], __hooks: [] };
    fragment.__callback = function () {
      emitter.emit('construct', fragment);
      const vNode = type(props);
      if (Array.isArray(vNode)) {
        fragment.props.children = vNode;
      } else if (typeof vNode === 'object' && vNode.type === 'fragment') {
        fragment.props = vNode.props;
        fragment.__effectsQueued = vNode.__effectsQueued;
        fragment.__effects = [].concat((fragment.__effects || []), (vNode.__effects || []));
        fragment.__hooks = [].concat((fragment.__hooks || []), (vNode.__hooks || []));
      } else {
        fragment.props.children = [vNode];
      }
    };
    fragment.__callback();
    return fragment;
  }

  return { type, props };
}

export function createRef() {
  return {};
}

export function Fragment(props) {
  return {
    type: 'fragment',
    props,
  };
}

export default {
  createElement,
  Fragment,
};
