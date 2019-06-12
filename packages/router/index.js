import { emitter, createElement } from '..';

import useEffect from '../hooks/useEffect';
import useState from '../hooks/useState';

function goto (url, history, type = 'push') {
  if (history && typeof history[type] === 'function') {
    history[type](url);
  } else if (
    typeof window !== 'undefined' &&
    typeof window.history !== 'undefined' &&
    typeof window.history[type + 'State'] === 'function'
  ) {
    window.history[type + 'State'](null, null, url);
  }
}

function currentUrl (history) {
  let url;
  if (history && history.location) {
    url = history.location;
  } else if (history && 'getCurrentLocation' in history && typeof history.getCurrentLocation === 'function') {
    url = history.getCurrentLocation();
  } else if (typeof window !== 'undefined' && typeof window.location !== 'undefined') {
    url = window.location;
  } else {
    return '';
  }
  return `${url.pathname || ''}${url.search || ''}${url.hash || ''}`;
}

export function Link ({ to: href, history, onClick: clickHandler, children }) {
  function onClick (e) {
    if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    e.preventDefault();
    goto(href, history);
    emitter.emit('nav', href);
    return false;
  }

  return createElement('a', { href, onClick: clickHandler || onClick }, children);
}

export function Route ({ render, component, children }) {
  if (typeof render === 'function') return render();
  if (typeof component !== 'undefined') {
    const element = createElement(component, {});
    element.__callback();
    return element;
  }
  return children || [];
}

export default function Routes ({ url: defaultUrl, history, children }) {
  const [url, setUrl] = useState(defaultUrl || currentUrl(history));

  useEffect(function() {
    emitter.on('nav', setUrl);
    return function () {
      emitter.off('nav', setUrl);
    }
  }, [setUrl]);

  return children.map(function(child) {
    child.props.remove = child.props.route !== 'undefined' && child.props.route !== url;
    return child;
  });
}
