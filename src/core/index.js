const Fragment = 'fragment';

function createElement(name, attributes = {}, ...args) {
  const children = (args.length ? [].concat(...args) : []).filter(Boolean).map(function(child) {
    const type = typeof child;
    // Render primitives as a text node.
    if (
      type === 'string'
      || type === 'number'
      || type === 'bigint'
      || type === 'symbol'
    ) {
      return { name: 'text', value: child.toString(), children: [], attributes: {} };
    }
    return child;
  });

  if (name === 'fragment') {
    return children;
  }

  const type = typeof name;
  if (type === 'function') {
    return { name: 'function', children, attributes: Object.assign({}, attributes, { children }), value: name };
  }

  if (name === null || type === 'boolean' || type === 'undefined') {
    return { name: 'empty', value: name, children: [], attributes: {} };
  }

  return { name, value: null, children, attributes: Object.assign({}, attributes, { children }) };
}

function createRef() {
  return { current: null };
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

export { Fragment, createElement, createRef, createContext };

export default { Fragment, createElement, createRef, createContext };
