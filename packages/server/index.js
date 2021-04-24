const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i;
const VOID_ELEMENTS = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/;

function styles(value = {}) {
  const set = Object.assign({}, value);
  return Object.keys(set).map(function(i) {
    return (i[0] === '-' && i[1] === '-') ? i : i.replace(/[A-Z]/g, '-$&') + ':' +
      (value && (i in value))
        ? (typeof set[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false)
        ? set[i] + 'px'
        : set[i]
        : ''
  }).join(';');
}

function renderChildren(vNode) {
  let html = '';
  for (let i = 0; i < vNode.attributes.children.length; i++) {
    html = html + renderToString(vNode.attributes.children[i]);
  }
  return html;
}

function renderToString(vNode) {
  let html = '';
  if (!vNode) {
    return html;
  } else if (vNode.type === 'fragment') {
    if (typeof vNode.__mount === 'function') vNode.__mount();
  } else if (vNode.type === 'text') {
    return vNode.__value;
  } else {
    html = '<' + vNode.type;
    for (let key in vNode.attributes) {
      if (vNode.attributes.hasOwnProperty(key)) {
        if (key !== 'children' && key !== 'key' && key !== 'ref' && key !== 'path') {
          const value = vNode.attributes[key];
          // const isSvg = vNode.type === 'svg';
          const name = key === 'className' ? 'class' : key;
          if ( name === 'style') {
            html = html + ' style="' + styles(value) + '"';
          } else if (name[0] === 'o' && name[1] === 'n') {
            // html = html + ' ' + name + '="javascript:' + value + '"';
          } else {
            html = html + ' ' + name + '="' + value + '"';
          }
        }
      }
    }
    if (String(vNode.type).match(VOID_ELEMENTS)) {
      return html + '/>';
    } else {
      html = html + '>';
    }
  }

  if (vNode.attributes.children) html = html + renderChildren(vNode);

  if (vNode.type !== 'function' && vNode.type !== 'fragment') {
    html += '</' + vNode.type + '>';
  }
  return html;
}

export {
  renderToString,
};

export default {
  renderToString
};
