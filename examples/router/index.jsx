import TinyJSX, { createContext } from 'tiny-jsx';
import { render } from 'tiny-jsx/dom';
import Router, { Link, Route } from 'tiny-jsx/router';

import Clock from '../components/Clock';
import TodoList from '../components/TodoList';

const Context = createContext();

function Page() {
  return (
    <Context.Provider value={{ test: 'context value 1' }}>
      <Context.Consumer>
        {ctx => {
          const v =  ctx.test;
          ctx.test = 'context value 2';
          return v;
        }}
      </Context.Consumer>
      <div>Page 2</div>
      <Context.Consumer>
        {ctx => {
          return ctx.test;
        }}
      </Context.Consumer>
    </Context.Provider>
  );
}

function Routes() {
  return (
    <>
      <nav>
        <Link to="/routes/">Home</Link>
        <Link to="/routes/#page1">Page 1</Link>
        <Link to="/routes/#page2">Page 2</Link>
        <Link to="/routes/#clock">Clock</Link>
        <Link to="/routes/#todos">ToDos</Link>
        <Link to="/a/b">Dynamic Routes</Link>
      </nav>
      <Router>
        <Route path="/routes/"><div>Home</div></Route>
        <Route path="/routes/#clock"><Clock resetState /></Route>
        <Route path="/routes/#clock"><Clock /></Route>
        <Route path={["/routes/#todos", /^\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i]}><TodoList /></Route>
        <Route path={/^\/(?:([^\/]+?))\/(?:([^\/]+?))\/?$/i} render={({ match: { params: [a, b] } }) => {
          return `matches: /${a}/${b}/`;
        }} />
        <Route path="/routes/#page1" render={() => (<div>Page 1</div>)} />
        <Route path="/routes/#page2" component={Page} />
      </Router>
    </>
  );
}

render(<Routes />, document.body);
