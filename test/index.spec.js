'use strict';

const expect = require('chai').expect;
const qs = require('qs');
const middleware = require('../');

function request(query) {
  return {
    method: 'GET',
    query: qs.parse(query)
  };
}

function response() {
  return {
    locals: {}
  };
}

function next() {}

describe('express-sequelize-sort', function() {

  describe('intended usage', function() {

    it('should only parse if sort query param present', function() {
      const req = request();
      const res = response();

      middleware(req, res, next);

      expect(res.locals.sort).to.be.undefined;
    });

    it('should parse ascending order', function() {
      const req = request('sort=name');
      const res = response();

      middleware(req, res, next);

      expect(res.locals.sort[0][0]).to.equal('name');
      expect(res.locals.sort[0][1]).to.equal('ASC');
    });

    it('should parse descending order', function() {
      const req = request('sort=-name');
      const res = response();

      middleware(req, res, next);

      expect(res.locals.sort[0][1]).to.equal('DESC');
    });

    it('should parse comma separated list', function() {
      const req = request('sort=-name,number');
      const res = response();

      middleware(req, res, next);

      expect(res.locals.sort).to.be.an.array;
      expect(res.locals.sort[0][0]).to.equal('name');
      expect(res.locals.sort[0][1]).to.equal('DESC');
      expect(res.locals.sort[1][0]).to.equal('number');
      expect(res.locals.sort[1][1]).to.equal('ASC');
    });

    it('should parse array', function() {
      const req = request('sort[0]=-name&sort[1]=number');
      const res = response();

      middleware(req, res, next);

      expect(res.locals.sort).to.be.an.array;
      expect(res.locals.sort[0][1]).to.equal('DESC');
      expect(res.locals.sort[1][1]).to.equal('ASC');
    });

    it('should parse an object', function() {
      const req = request('sort[name]=-1&sort[number]=1');
      const res = response();

      middleware(req, res, next);

      expect(res.locals.sort).to.be.an.array;
      expect(res.locals.sort[0][1]).to.equal('DESC');
      expect(res.locals.sort[1][1]).to.equal('ASC');
    });

  });

  describe('unintended usage', function() {

    it('should not error on garbage input', function() {
      const res = response();

      middleware(request('sort'), res, next);
      middleware(request('sort='), res, next);
      middleware(request('sort=""'), res, next);
      middleware(request('sort=" "'), res, next);
      middleware(request('sort=" -"'), res, next);
      middleware(request('sort=" - "'), res, next);
      middleware(request('sort=-1'), res, next);
      middleware(request('sort=0'), res, next);
      middleware(request('sort=1'), res, next);
      middleware(request('sort=[]'), res, next);
      middleware(request('sort[]'), res, next);
      middleware(request('sort[]&sort[]'), res, next);
      middleware(request('sort[0]&sort[1]'), res, next);
      middleware(request('sort[0]=-name&sort[1]'), res, next);
      middleware(request('sort[a]'), res, next);

      expect(true).to.be.true;
    });

  });

});
