import TinyJSX from 'tiny-jsx';
import { StaticRouter } from 'tiny-jsx/router';
import { renderToString } from 'tiny-jsx/server';

import Routes from '../components/Routes';

export default function () {
  const html = renderToString(
    <StaticRouter url="/routes/#todos">
      <Routes />
    </StaticRouter>
  );
  return `
<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=11" />
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, shrink-to-fit=yes" />
</head>
<body>${html}</body>
</html>
`;
}
