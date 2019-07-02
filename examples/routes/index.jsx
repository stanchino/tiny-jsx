import TinyJSX from 'tiny-jsx';
import { hydrate } from 'tiny-jsx/dom';
import Router from 'tiny-jsx/router';

import Routes from '../components/Routes';

hydrate(
  <Router>
    <Routes />
  </Router>,
document.body);
