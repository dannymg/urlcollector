'use strict';

//Change NODE_ENV to 'test'
process.env.NODE_ENV = 'test';

/**
 * Assertion and testing utilities
 */
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.should = chai.should;
