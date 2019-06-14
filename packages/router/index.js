import { emitter, createElement, createContext } from '..';
export { Fragment as Switch } from '..';

import useEffect from '../hooks/useEffect';
import useState from '../hooks/useState';

const ctx = createContext();

function matchPath(path, url) {
  if (typeof path === 'undefined' || typeof url === 'undefined') return [false, []];
  if (typeof path === 'string') return [path === url, []];
  if (typeof path === 'object' && typeof path.exec === 'function') {
    const matches = path.exec(url);
    if (!matches) return [false, []];
    return [true, matches.slice(1, matches.length)];
  }
  if (Array.isArray(path)) {
    let [match, matches] = [false, []];
    path.some(p => {
      [match, matches] = matchPath(p, url);
      return match;
    });
    return [match, matches];
  }
  throw new Error(`Unsupported path type ${path}`);
}

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

export function Route ({ path, render, component, resetState, children }) {
  return ctx.Consumer({
    children: function (context) {
      const [match, matches] = matchPath(path, context.url);
      if (typeof render === 'function') return match && render({ matches, resetState });
      if (typeof component !== 'undefined') return match && component({ matches, resetState });
      return (children || []).map(function(child) {
        child.__remove = !match;
        child.props.match = { params: matches };
        child.props.resetState = child.props.resetState || resetState;
        return child;
      });
    }
  });
}

export default function Router ({ url: defaultUrl, history, children }) {
  const [url, setUrl] = useState(defaultUrl || currentUrl(history));

  useEffect(function() {
    emitter.on('nav', setUrl);
    return function () {
      emitter.off('nav', setUrl);
    }
  }, [url, setUrl]);

  return ctx.Provider({ value: { url }, children });
}
