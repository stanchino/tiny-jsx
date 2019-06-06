export { emitter } from './emitter';
export * from './hooks';

export function createElement(type, props, children) {
  props = Object.assign({}, props);
  if (arguments.length > 3) {
    children = [children];
    for (let i = 3; i < arguments.length; i++) {
      children.push(arguments[i]);
    }
  }
  if (children != null) {
    props.children = children;
  }
  const { ref, key, ...rest } = props;
  return { type, props: rest, key, ref };
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
