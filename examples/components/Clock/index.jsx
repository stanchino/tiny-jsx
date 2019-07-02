import TinyJSX from 'tiny-jsx';
import useEffect from 'tiny-jsx/hooks/useEffect';
import useState from 'tiny-jsx/hooks/useState';

export default function Clock ({ color }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [tick]);

  return <><span style={{ color }}>Seconds:</span> <span>{tick}</span></>;
}
