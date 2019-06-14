import { emitter } from '..';

emitter.on('render', render);

const XLINK_NS = 'http://www.w3.org/1999/xlink';
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

function propsChanged(vNode, oldNode) {
  if (!oldNode || oldNode.type !== vNode.type) return true;
  if (vNode.type === 'text') {
    return oldNode.__value !== vNode.__value;
  } else if (vNode.type === 'fragment') {
    return false;
  } else if (typeof vNode.type === 'string') {
    return Object.keys(vNode.props).some(key => {
      return key !== 'children' && key !== 'ref' && oldNode.props[key] !== vNode.props[key];
    });
  }
  return false;
}

function eventProxy(DOMNode) {
  return function (e) {
    return DOMNode.__listeners[e.type](e);
  }
}

function setStyle(DOMNode, value = {}, oldValue = {}) {
  const set = Object.assign(Object.assign({}, oldValue), value);
  for (let i in set) {
    if (set.hasOwnProperty(i) && value[i] !== oldValue[i]) {
      DOMNode.style.setProperty(
        (i[0] === '-' && i[1] === '-') ? i : i.replace(/[A-Z]/g, '-$&'),
        (value && (i in value))
          ? (typeof set[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false)
          ? set[i] + 'px'
          : set[i]
          : ''
      );
    }
  }
}

function setEvent(DOMNode, name, value, oldValue) {
  const useCapture = name !== (name = name.replace(/Capture$/, ''));
  const nameLower = name.toLowerCase();
  name = (nameLower in DOMNode ? nameLower : name).slice(2);
  if (value && !oldValue) {
    DOMNode.addEventListener(name, eventProxy(DOMNode), useCapture);
  } else if (!value) {
    DOMNode.removeEventListener(name, eventProxy(DOMNode), useCapture);
  }
  (DOMNode.__listeners || (DOMNode.__listeners = {}))[name] = value;
}

function setAttribute(DOMNode, name, value) {
  if (name !== (name = name.replace(/^xlink:?/, ''))) {
    if (value == null || value === false) {
      DOMNode.removeAttributeNS(XLINK_NS, name.toLowerCase());
    } else {
      DOMNode.setAttributeNS(XLINK_NS, name.toLowerCase(), value);
    }
  } else if (value == null || value === false) {
    DOMNode.removeAttribute(name);
  } else {
    DOMNode.setAttribute(name, value);
  }
}

function setProperty(name, vNode, oldValue) {
  const DOMNode = vNode.__DOMNode;
  const value = vNode.props[name];
  const isSvg = vNode.type === 'svg';
  name = name === 'className' ? 'class' : name;

  if ( name === 'style') {
    setStyle(DOMNode, value, oldValue);
  } else if (name[0] === 'o' && name[1] === 'n') {
    setEvent(DOMNode, name, value, oldValue);
  } else if (name !== 'list' && name !== 'tagName' && !isSvg && (name in DOMNode)) {
    DOMNode[name] = value == null ? '' : value;
  } else if (typeof value !== 'function' && name !== 'dangerouslySetInnerHTML' && (name in DOMNode)) {
    setAttribute(DOMNode, name, value);
  }
}

function setRef(vNode) {
  if (typeof vNode.props.ref === 'function') {
    vNode.props.ref(vNode.__DOMNode);
  } else if (typeof vNode.props.ref === 'object') {
    vNode.props.ref.current = vNode.__DOMNode;
  }
}

function setProperties(vNode, oldProps = {}) {
  for (let key in vNode.props) {
    if (vNode.props.hasOwnProperty(key)) {
      if (key !== 'children' && key !== 'key' && key !== 'ref' && key !== 'path') {
        setProperty(key, vNode, oldProps[key]);
      }
    }
  }
}

function renderChildren(vNode, oldChildren) {
  if (vNode.props.children.length === 0) return;
  for (let i in vNode.props.children) {
    if (vNode.props.children.hasOwnProperty(i)) {
      render(vNode.props.children[i], vNode.__DOMNode, oldChildren[i]);
    }
  }
}

function removeChildren(vNode, oldChildren) {
  if (oldChildren.length <= vNode.props.children.length) return;
  for (let i = vNode.props.children.length; i < oldChildren.length; i++) {
    if (oldChildren[i].__DOMNode && vNode.__DOMNode !== oldChildren[i].__DOMNode && vNode.__DOMNode.contains(oldChildren[i].__DOMNode)) {
      vNode.__DOMNode.removeChild(oldChildren[i].__DOMNode);
    }
  }
}

function removeNode(vNode, parentDOMNode) {
  if (vNode.__DOMNode) {
    for (let i in vNode.props.children) {
      if (vNode.props.children[i].__DOMNode) {
        removeNode(vNode.props.children[i], vNode.__DOMNode);
      }
    }
    if (parentDOMNode && parentDOMNode !== vNode.__DOMNode && parentDOMNode.contains(vNode.__DOMNode)) {
      parentDOMNode.removeChild(vNode.__DOMNode);
    }
    delete vNode.__DOMNode;
    if (vNode.props.resetState) {
      vNode.__effectsQueued = false;
      vNode.__effects = [];
      vNode.__hooks = [];
    }
  }
}

export function render(vNode, parentDOMNode, oldNode = {}) {
  if (!parentDOMNode && !vNode.__DOMNode && !oldNode.__DOMNode) return;

  if (!vNode) return oldNode && removeNode(oldNode, parentDOMNode);
  if (vNode.__remove) return removeNode(vNode, parentDOMNode);

  const oldProps = Object.assign({}, oldNode.props || vNode.props);
  if (vNode.type === 'function' && typeof vNode.__callback === 'function') vNode.__callback();

  let exists = vNode.__DOMNode || oldNode.__DOMNode;
  let rerender = exists ? propsChanged(vNode, oldNode) : vNode.type !== 'fragment' && vNode.type !== 'function';
  if (exists && oldNode.__DOMNode) {
    vNode.__DOMNode = oldNode.__DOMNode;
  } else if (!exists) {
    if (vNode.type === 'text') {
      vNode.__DOMNode = document.createTextNode(String(vNode.__value));
    } else if (vNode.type === 'fragment' || vNode.type === 'function') {
      vNode.__DOMNode = parentDOMNode;
    } else if (!vNode.__DOMNode && typeof vNode.type === 'string') {
      vNode.__DOMNode = document.createElement(vNode.type);
    } else if (!vNode.__DOMNode) {
      throw new Error(`Unknown Virtual DOM node type ${vNode.type}`);
    }
  }

  if (exists && rerender && vNode.type === 'text') {
    vNode.__DOMNode.nodeValue = vNode.__value;
  } else if (!exists && rerender) {
    parentDOMNode.appendChild(vNode.__DOMNode);
  }

  if (rerender) {
    !exists && setRef(vNode);
    setProperties(vNode, exists && oldProps);
  }

  if (vNode.props.children) {
    renderChildren(vNode, oldProps.children || []);
    removeChildren(vNode,oldProps.children || []);
  }
}

export const createPortal = render;

export default {
  createPortal,
  render,
};
