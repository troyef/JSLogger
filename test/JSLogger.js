var assert = require('assert');
var logger = require('../JSLogger');


describe('JSLogger', function() {
  it('logArray should start empty', function () {
    assert.equal(0, logger.logArray.length);
  });
  
  describe('#log()', function () {
    it('calling log should add an entry to the logArray', function () {
      logger.log('test');
      assert.equal(1, logger.logArray.length);
    });
  });
});