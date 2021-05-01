const assert = require("assert");
const { createElement, createRef, createContext, Fragment } = require("../../packages");

describe('Fragment', function() {
  it('returns the string', function() {
    assert.strictEqual(Fragment, 'fragment');
  })
});

describe('createElement', function() {
  describe('fragment', function() {
    it('ignores empty children', function() {
      const e = createElement('fragment', undefined, null, false, undefined);
      assert.deepStrictEqual(e, []);
    });
    it('handles String as text node', function() {
      const e = createElement('fragment', undefined, 'string');
      assert.deepStrictEqual(e, [{ name: 'text', value: 'string', children: [], attributes: {} }]);
    });
    it('handles Number as text node', function() {
      const e = createElement('fragment', undefined, Number(5));
      assert.deepStrictEqual(e, [{ name: 'text', value: '5', children: [], attributes: {} }]);
    });
    it('handles BigInt as text node', function() {
      const e = createElement('fragment', undefined, BigInt(5000000000000));
      assert.deepStrictEqual(e, [{ name: 'text', value: '5000000000000', children: [], attributes: {} }]);
    });
    it('handles Symbol as text node', function() {
      const e = createElement('fragment', undefined, Symbol('a'));
      assert.deepStrictEqual(e, [{ name: 'text', value: 'Symbol(a)', children: [], attributes: {} }]);
    });
    it('returns objects as children', function() {
      const div = { name: 'div', value: null, children: [], attributes: {} };
      const e = createElement('fragment', undefined, div);
      assert.deepStrictEqual(e, [div]);
    });
  });

  describe('function', function() {
    it('returns the correct object', function() {
      const noop = function(){};
      const div = { name: 'div', value: null, children: [], attributes: {} };
      const e = createElement(noop, { foo: 'bar' }, div);
      assert.deepStrictEqual(e, {
        name: 'function', children: [div], attributes: { foo: 'bar', children: [div] }, value: noop,
      });
    });
  });

  describe('empty', function() {
    it('returns empty for null', function() {
      const e = createElement(null, undefined);
      assert.deepStrictEqual(e, { name: 'empty', value: null, children: [], attributes: {}});
    });
    it('returns empty for true', function() {
      const e = createElement(true, undefined);
      assert.deepStrictEqual(e, { name: 'empty', value: true, children: [], attributes: {}});
    });
    it('returns empty for false', function() {
      const e = createElement(false, undefined);
      assert.deepStrictEqual(e, { name: 'empty', value: false, children: [], attributes: {}});
    });
    it('returns empty for undefined', function() {
      const e = createElement(undefined, undefined);
      assert.deepStrictEqual(e, { name: 'empty', value: undefined, children: [], attributes: {}});
    });
  });

  describe('custom tag', function() {
    it('returns the correct object', function() {
      const div = { name: 'div', value: null, children: [], attributes: {} };
      const e = createElement('section', { foo: 'bar' }, div);
      assert.deepStrictEqual(e, {
        name: 'section', children: [div], attributes: { foo: 'bar', children: [div] }, value: null,
      });
    });
  });
});

describe('createRef', function() {
  it('set current to null', function() {
    assert.deepStrictEqual(createRef(), { current: null });
  });
});

describe('createContext', function() {
  const context = createContext();
  describe('Consumer', function() {
    it('works with function prop', function() {
      context.Consumer(function(ctx) {
        assert.deepStrictEqual({}, ctx);
      })
    });
    it('works with function as a child', function() {
      context.Consumer({ children: [
          function(ctx) {
            assert.deepStrictEqual({}, ctx);
          }
        ]});
    });
    it('raises an exception', function() {
      assert.throws(function() {
        context.Consumer({});
      }, { message: 'Unsupported context consumer' });
    });
  });

  describe('Provider', function() {
    it('assigns provider value to context', function() {
      const value = 'value';
      context.Provider({ value });
      context.Consumer(function(ctx) {
        assert.deepStrictEqual(ctx, value);
      })
    });

    it('returns the children', function() {
      const children = ['child1', 'child2'];
      const provider = context.Provider({ children });
      assert.deepStrictEqual(provider, children);
    });
  });
});
