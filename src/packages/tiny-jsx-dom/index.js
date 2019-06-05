import emitter from '../tiny-jsx-emitter';

emitter.on('render', function(vNode) {
  render(vNode, vNode.__parentDOMNode, vNode.__DOMNode);
});

export function render(vNode, parentDOMNode, oldDOMNode) {
  let DOMNode;
  if (typeof vNode.type === 'function') {
    emitter.emit('construct', vNode);
    DOMNode = render(vNode.type(vNode.props), parentDOMNode);
  } else if (typeof vNode === 'object') {
    const { children, ...props } = vNode.props;
    DOMNode = vNode.type === 'fragment' ? document.createDocumentFragment() : document.createElement(vNode.type, props);
    if (children) {
      if (Array.isArray(children)) {
        children.forEach(function(child) {
          if (typeof child !== 'undefined') {
            render(child, DOMNode);
          }
        });
      } else {
        render(children, DOMNode);
      }
    }
  } else {
    DOMNode = document.createTextNode(vNode);
  }

  if (typeof vNode === 'function' || typeof vNode === 'object') {
    vNode.__parentDOMNode = parentDOMNode;
    vNode.__DOMNode = DOMNode;
  }

  if (typeof vNode.ref === 'function') {
    vNode.ref(DOMNode);
  } else if (typeof vNode.ref === 'object') {
    vNode.ref.current = DOMNode;
  }

  if (typeof DOMNode !== 'undefined') {
    if (oldDOMNode) {
      parentDOMNode.replaceChild(DOMNode, oldDOMNode);
    } else {
      parentDOMNode.appendChild(DOMNode);
    }
  }
  return DOMNode;
}
