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

function setProperty(DOMNode, name, value, oldValue, isSvg) {
  name = name === 'className' ? 'class' : name;

  if ( name === 'style') {
    const set = Object.assign(Object.assign({}, oldValue), value);
    for (let i in set) {
      if ((value || {})[i] === (oldValue || {})[i]) {
        continue;
      }
      DOMNode.style.setProperty(
        (i[0] === '-' && i[1] === '-') ? i : i.replace(/[A-Z]/g, '-$&'),
        (value && (i in value))
          ? (typeof set[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false)
          ? set[i] + 'px'
          : set[i]
          : ''
      );
    }
  } else if (name[0]==='o' && name[1]==='n') {
    const useCapture = name !== (name=name.replace(/Capture$/, ''));
    const nameLower = name.toLowerCase();
    name = (nameLower in DOMNode ? nameLower : name).slice(2);
    if (value) {
      if (!oldValue) {
        DOMNode.addEventListener(name, eventProxy(DOMNode), useCapture);
      }
    } else {
      DOMNode.removeEventListener(name, eventProxy(DOMNode), useCapture);
    }
    (DOMNode.__listeners || (DOMNode.__listeners = {}))[name] = value;
  } else if (name !== 'list' && name !== 'tagName' && !isSvg && (name in DOMNode)) {
    DOMNode[name] = value == null ? '' : value;
  } else if (typeof value !== 'function' && name !== 'dangerouslySetInnerHTML') {
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
}

export function render(vNode, parentDOMNode, oldNode = {}) {
  if (!parentDOMNode && !vNode.__DOMNode && !oldNode.__DOMNode) {
    throw new Error('Missing parent DOM element.');
  }

  const oldProps = oldNode.props || Object.assign({}, vNode.props);
  const oldChildren = oldProps.children || [];
  if (vNode.type === 'fragment' && typeof vNode.__callback === 'function') {
    vNode.__callback();
  }

  let draw = false;
  let exists = false;
  if (!vNode.__DOMNode && !oldNode.__DOMNode) {
    draw = true;
    if (vNode.type === 'text') {
      vNode.__DOMNode = document.createTextNode(String(vNode.__value));
    } else if (vNode.type === 'fragment') {
      vNode.__DOMNode = parentDOMNode;
      draw = false;
    } else if (!vNode.__DOMNode && typeof vNode.type === 'string') {
      vNode.__DOMNode = document.createElement(vNode.type);
    } else if (!vNode.__DOMNode) {
      throw new Error(`Unknown Virtual DOM node type ${vNode.type}`);
    }
  } else {
    exists = true;
    if (oldNode.__DOMNode) vNode.__DOMNode = oldNode.__DOMNode;
    draw = propsChanged(vNode, oldNode);
  }

  if (exists && draw && vNode.type === 'text') {
    vNode.__DOMNode.nodeValue = vNode.__value;
  } else if (!exists && draw) {
    parentDOMNode.appendChild(vNode.__DOMNode);
  }

  if (draw) {
    const ref = vNode.props.ref;
    if (typeof ref === 'function') {
      ref(vNode.__DOMNode);
    } else if (typeof ref === 'object') {
      ref.current = vNode.__DOMNode;
    }

    for (let key in vNode.props) {
      if (key !== 'children' && key !== 'key' && key !== 'ref') {
        setProperty(vNode.__DOMNode, key, vNode.props[key], exists && oldProps[key], vNode.type === 'svg');
      }
    }
  }

  if (vNode.props.children) {
    if (vNode.props.children.length > 0) {
      for (let i in vNode.props.children) {
        render(vNode.props.children[i], vNode.__DOMNode, oldChildren[i]);
      }
    }
    if (oldChildren.length > vNode.props.children.length) {
      for (let i = vNode.props.children.length; i < oldChildren.length; i++) {
        vNode.__DOMNode.removeChild(oldChildren[i].__DOMNode);
      }
    }
  }
}
