import TinyJSX, { createRef, useEffect, useState } from 'tiny-jsx';

function ListItem ({ text, children }) {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(counter => counter + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [name, counter]);

  return (
    <li>{text}{children}: {counter}</li>
  );
}

function List () {
  useEffect(() => {
    console.log('useEffect List');
  });

  return (
    <ul>
      <ListItem text="Item 1" />
      <ListItem>Item 2</ListItem>
      <ListItem text="Item 3" />
      <ListItem>Item 4</ListItem>
    </ul>
  )
}

export default function App() {
  const ref = createRef();
  useEffect(() => {
    console.log('useEffect App', ref.current);
  });
  return (
    <>
      <div ref={ref}>Hello world</div>
      <List />
      <hr />
    </>
  );
}
