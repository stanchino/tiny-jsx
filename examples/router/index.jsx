import TinyJSX from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import Routes, { Link, Route } from 'tiny-jsx/router';

import Clock from '../components/Clock';
import TodoList from '../components/TodoList';

function Page() {
  return <div>Page 2</div>;
}

function Router() {
  return (
    <>
      <nav>
        <Link to="/routes/">Home</Link>
        <Link to="/routes/#page1">Page 1</Link>
        <Link to="/routes/#page2">Page 2</Link>
        <Link to="/routes/#clock">Clock</Link>
        <Link to="/routes/#todos">ToDos</Link>
      </nav>
      <Routes>
        <Clock route="/routes/#clock" />
        <Clock reset route="/routes/#clock" />
        <TodoList route="/routes/#todos" />
        <Route route="/routes/"><div>Home</div></Route>
        <Route route="/routes/#page1" render={() => (<div>Page 1</div>)} />
        <Route route="/routes/#page2" component={Page} />
      </Routes>
    </>
  );
}

render(<Router />, document.body);
