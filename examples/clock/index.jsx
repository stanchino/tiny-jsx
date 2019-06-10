import TinyJSX, { createRef } from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import useEffect from 'tiny-jsx/hooks/useEffect';
import useState from 'tiny-jsx/hooks/useState';

function Clock ({ ref }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return <div ref={ref}><span>Seconds:</span> <span>{tick}</span></div>;
}

render(<Clock ref={createRef()} />, document.body);
