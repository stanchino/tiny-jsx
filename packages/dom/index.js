import { emitter } from '..';

emitter.on('render', update);

const XLINK_NS = 'http://www.w3.org/1999/xlink';
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

function eventProxy(DOMNode) {
  return function (e) {
    return DOMNode.__listeners[e.type](e);
  }
}

function setStyle(DOMNode, value = {}) {
  const set = Object.assign({}, value);
  for (let i in set) {

    if (set.hasOwnProperty(i)) {
      const v = (value && (i in value))
        ? (typeof set[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false)
          ? set[i] + 'px'
          : set[i]
        : '';
      if (!DOMNode.style || DOMNode.style.getPropertyValue(i) !== v) {
        DOMNode.style.setProperty((i[0] === '-' && i[1] === '-') ? i : i.replace(/[A-Z]/g, '-$&'), v);
      }
    }
  }
}

function setEvent(DOMNode, name, value) {
  const useCapture = name !== (name = name.replace(/Capture$/, ''));
  const nameLower = name.toLowerCase();
  name = (nameLower in DOMNode ? nameLower : name).slice(2);
  if (value && (!DOMNode.__listeners || !DOMNode.__listeners[name])) {
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

function setProperty(name, vNode) {
  const DOMNode = vNode.__DOMNode;
  const value = vNode.props[name];
  const isSvg = vNode.type === 'svg';
  name = name === 'className' ? 'class' : name;

  if ( name === 'style') {
    setStyle(DOMNode, value);
  } else if (name[0] === 'o' && name[1] === 'n') {
    setEvent(DOMNode, name, value);
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

function setProperties(vNode) {
  for (let key in vNode.props) {
    if (vNode.props.hasOwnProperty(key)) {
      if (key !== 'children' && key !== 'key' && key !== 'ref' && key !== 'path') {
        setProperty(key, vNode);
      }
    }
  }
}

function mount (vNode) {
  if (typeof vNode.__unmount === 'function') vNode.__unmount();
  if (typeof vNode.__mount === 'function') return vNode.__mount();
}

function flatten(vNode, depth = 0) {
  let empty = 0;
  return vNode.props.children.map(function (child, i) {
    if (child) {
      child.__index = i - empty + (vNode.type === 'fragment' ? vNode.__index : 0);
      child.__key = depth + '-' + child.__index;
      child.__parents = vNode.__parents.concat([vNode.__key]);
      if (child.type === 'fragment') {
        child.__DOMNode = vNode.__DOMNode;
        child.__depth = depth;
        mount(child);
        if (!child.props.children || child.props.children.filter(Boolean).length === 0) empty++;
        else return flatten(child, depth + 1);
      } else if (child) {
        if (child.props.children) child.props.children = flatten(child, depth + 1);
        return [child];
      }
    }
  }).reduce(function(a, b) {
    return a.concat(b);
  }, []).filter(Boolean);
}

function processDOMNode(vNode) {
  vNode.__DOMNode.__index = vNode.__index;
  vNode.__DOMNode.__key = vNode.__key;
  vNode.__DOMNode.__parents = vNode.__parents;
  if (vNode.type !== 'text') {
    setProperties(vNode);
  } else if (vNode.__DOMNode.nodeValue !== vNode.__value) {
    vNode.__DOMNode.nodeValue = vNode.__value;
  }
}

function createDOMNode(vNode) {
  vNode.__DOMNode = vNode.type === 'text'
    ? document.createTextNode(String(vNode.__value))
    : document.createElement(vNode.type);
  processDOMNode(vNode);
  setRef(vNode);
  return vNode.__DOMNode;
}

function hydrateDOMNode(vNode, DOMNode) {
  if (
    typeof DOMNode.__index !== 'undefined' && vNode.__index !== DOMNode.__index ||
    !(vNode.type === 'text' ? DOMNode instanceof Text : DOMNode.tagName === vNode.type.toUpperCase())
  ) return false;
  vNode.__DOMNode = DOMNode;
  processDOMNode(vNode);
  // console.debug('hydrate', vNode.__DOMNode);
  return true;
}

function renderChild(vNode, parentDOMNode, oldDOMNode, insertBefore = null) {
  if (!oldDOMNode) {
    parentDOMNode.insertBefore(createDOMNode(vNode), insertBefore);
    // console.debug('append', parentDOMNode, vNode.__DOMNode, insertBefore);
  } else if (!hydrateDOMNode(vNode, oldDOMNode)) {
    parentDOMNode.replaceChild(createDOMNode(vNode), oldDOMNode);
    // console.debug('replaceChild', parentDOMNode, vNode.__DOMNode, oldDOMNode);
  }
}
function renderChildren(children, parentDOMNode, oldChildren, insertBefore = null) {
  children.forEach(function(child, i) {
    const oldDOMNode = oldChildren[i];
    renderChild(child, parentDOMNode, oldDOMNode, insertBefore);
    if (child.props.children) {
      renderChildren(child.props.children, child.__DOMNode, child.__DOMNode.childNodes);
    }
  });
  if (children.length < oldChildren.length) {
    Array.prototype.slice.call(oldChildren, children.length, oldChildren.length).forEach(function(child) {
      parentDOMNode.removeChild(child);
    })
  }
}

function update(vNode) {
  if (!vNode.__DOMNode || vNode.type !== 'fragment') throw new Error('error');
  mount(vNode);
  let firstIndex;
  let lastIndex;
  vNode.__DOMNode.childNodes.forEach(function(child, i) {
    if (typeof firstIndex === 'undefined' && i >= vNode.__index && child.__parents.indexOf(vNode.__key) !== -1) firstIndex = i;
    if (typeof firstIndex !== 'undefined' && child.__parents.indexOf(vNode.__key) !== -1) lastIndex = i;
  });
  const oldChildren = Array.prototype.slice.call(vNode.__DOMNode.childNodes, firstIndex, lastIndex + 1);
  // console.debug(vNode.__key, firstIndex, lastIndex, oldChildren);
  if (vNode.props.children) {
    const children = flatten(vNode);
    renderChildren(children, vNode.__DOMNode, oldChildren, vNode.__DOMNode.childNodes[lastIndex + 1]);
  }
}

function render(vNode, parentDOMNode) {
  if (!parentDOMNode) throw new Error('error');
  if (vNode.type === 'fragment') {
    if (typeof vNode.__index === 'undefined') vNode.__index = 0;
    if (typeof vNode.__depth === 'undefined') vNode.__depth = 0;
    if (typeof vNode.__key === 'undefined') vNode.__key = '0-0';
    if (typeof vNode.__parents === 'undefined') vNode.__parents = [];
    if (typeof vNode.__DOMNode === 'undefined') vNode.__DOMNode = parentDOMNode;
    mount(vNode);
  } else {
    renderChild(vNode, parentDOMNode, parentDOMNode.childNodes[0]);
  }
  if (vNode.props.children) {
    const children = flatten(vNode);
    renderChildren(children, vNode.__DOMNode, vNode.__DOMNode.childNodes);
  }
}

export { render as hydrate, render, render as createPortal };

export default {
  createPortal: render,
  hydrate: render,
  render,
};
