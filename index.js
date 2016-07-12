'use strict';

function isSortAsc(sortString) {
  return sortString[0] !== '-';
}

function sortMiddleware(req, res, next) {
  let querySort = req.query.sort;

  if (querySort) {
    let sort = [];

    if (typeof querySort === 'string') {
      querySort = querySort.split(',');
    }

    if (Array.isArray(querySort)) {
      sort = querySort.map(query => {
        return [
          query.replace(/^-/, ''),
          isSortAsc(query) ? 'ASC' : 'DESC'
        ];
      });
    }
    else {
      for (let key in querySort) {
        if (querySort.hasOwnProperty(key)) {
          sort.push([
            key,
            parseInt(querySort[key], 10) > 0 ? 'ASC' : 'DESC'
          ]);
        }
      }
    }

    res.locals.sort = sort;
  }
  next();
}

module.exports = sortMiddleware;
