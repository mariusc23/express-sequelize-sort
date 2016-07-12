# express-sequelize-sort

> Parse req.query.sort to res.locals.sort

## Installation

    npm install --save express-sequelize-sort

## Usage

Mount the middleware in your router.

```js
app.get('/api/items', require('express-sequelize-sort'), ctrl);
```

If there is a `req.query.sort` value, the middleware will convert it to something sequelize understands.

```js
'?sort=-name,number'            => [['name', 'DESC'], ['number', 'ASC']]
'?sort[0]=-name&sort[1]=number' => [['name', 'DESC'], ['number', 'ASC']]
'?sort[name]=-1&sort[number]=1' => [['name', 'DESC'], ['number', 'ASC']]
```

**NOTE:** This module does not validate the actual sort properties. You might want to pick only the ones you know are valid for that specific route instead of passing directly to sequelize.

```js
const ALLOWABLE_SORT_PROPS = ['name', 'number'];

function ctrl(req, res, next) {
  const sort = res.locals.sort.filter(order => (ALLOWABLE_SORT_PROPS.indexOf(order[0]) !== -1));
  // ...
}
```

## License

Copyright (c) 2016 Marius Craciunoiu. Licensed under the MIT license.
