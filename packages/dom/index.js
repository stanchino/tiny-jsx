const { state } = require('../hooks/core');

const XLINK_NS = 'http://www.w3.org/1999/xlink';

const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;

function eventProxy(DOMNode) {
  return function (e) {
    return DOMNode.__listeners[e.type](e);
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

function processDOMNode(vNode, domNode) {
  const a = vNode.attributes || {};
  // copy attributes onto the new node:
  Object.keys(a).forEach(function (k) {
    if (k === 'children') return;
    if (k[0] === 'o' && k[1] === 'n') {
      setEvent(domNode, k, a[k]);
    } else if (k === 'style') {
      setStyle(domNode, a[k]);
    } else if (k === 'className') {
      setAttribute(domNode, 'class', a[k]);
    } else if (k !== 'list' && k !== 'tagName' && vNode.name !== 'svg' && (k in domNode)) {
      domNode[k] = a[k] == null ? '' : a[k];
    } else if (typeof a[k] !== 'function' && k !== 'dangerouslySetInnerHTML' && (k in domNode)) {
      setAttribute(domNode, k, a[k])
    }
  });
}

function isChanged(oldNode, newNode) {
  return Object.keys(newNode.attributes || {}).some(function(arg) {
    if (arg === 'children') return false;
    return oldNode.attributes[arg] !== newNode.attributes[arg];
  });
}

function isString(vNode) {
  const type = typeof vNode;
  return (
    type === 'string'
    || type === 'number'
    || type === 'bigint'
    || type === 'symbol'
  );
}

function domNode(vNode) {
  if (vNode.name === 'text') return document.createTextNode(vNode.value);
  const domNode = document.createElement(vNode.name);
  processDOMNode(vNode, domNode);
  return domNode;
}

function removeExtraChildren(oldChildren, from) {
  try {
    oldChildren.slice(from).forEach(function (c) {
      if (c.name === 'function') {
        removeExtraChildren(c.children, 0);
      } else {
        c.domNode.remove();
      }
    });
  } catch (e) {
    console.log('remove extra children error', e, from, oldChildren);
  }
}

function render(node, parent, oldNode = undefined) {
  const type = typeof node;
  // skip empty nodes
  if (node === null || type === 'boolean' || type === 'undefined') {
    return;
  }
  // Render string, number, bigint and symbol as a text node.
  const vNode = isString(node) ? { name: 'text', value: node, children: [], attributes: {} } : node;

  // process function
  if (vNode.name === 'function') {
    state.index = 0;
    state.vNode = vNode;

    // refresh is used to re-render the DOM tree
    vNode.refresh = function () {
      render(this, parent, Object.assign({}, this));
    };

    // render children
    let children = vNode.value(vNode.attributes);
    children = (Array.isArray(children) ? children : [children])
    children = children.map(function(child) {
      // Convert string, number, bigint and symbol primitives to text
      if (child === null || typeof child === 'boolean' || typeof child === 'undefined') {
        return { name: 'empty', value: child, children: [], attributes: {} };
      }
      return isString(child) ? { name: 'text', value: child, children: [], attributes: {} } : child;
    });

    children.forEach(function(c, i) {
      c.prev = children[i-1];
      render(c, parent, oldNode ? oldNode.children[i] : undefined);
    });
    vNode.children = children;

    // remove excess children
    if (oldNode) removeExtraChildren(oldNode.children || [], vNode.children.length);
    return;
  }

  // render
  try {
    if (!oldNode) {
      vNode.domNode = domNode(vNode);
      if (vNode.prev && vNode.prev.domNode && vNode.prev.domNode.nextSibling) {
        // console.log('insert after', parent, vNode);
        parent.insertBefore(vNode.domNode, vNode.prev.domNode.nextSibling);
      } else {
        // console.log('append', parent, vNode);
        parent.appendChild(vNode.domNode);
      }
    } else if ((oldNode.name !== vNode.name) || oldNode.value !== vNode.value) {
      vNode.domNode = domNode(vNode);
      // console.log('replace', oldNode, vNode);
      if (oldNode.domNode) oldNode.domNode.replaceWith(vNode.domNode);
    } else if (isChanged(oldNode, vNode)) {
      // console.log('update', oldNode, vNode);
      vNode.domNode = oldNode.domNode;
      processDOMNode(vNode, vNode.domNode);
    } else {
      // console.log('keep', oldNode, vNode);
      vNode.domNode = oldNode.domNode;
    }
  } catch (e) {
    console.log('render error', e, parent, vNode, oldNode);
  }

  // render children
  vNode.children.forEach(function(c, i) {
    c.prev = vNode.children[i-1];
    render(c, vNode.domNode, oldNode ? oldNode.children[i] : undefined);
  });

  // remove excess children
  if (oldNode) removeExtraChildren(oldNode.children || [], vNode.children.length);
}

export { render as hydrate, render, render as createPortal };

export default {
  createPortal: render,
  hydrate: render,
  render,
};
