(function() {

  'use strict';

  module.exports = function(app) {
  	var indexCtrl = require('../controllers/indexServerController.js');
  	app.get('/', indexCtrl.message);
  };

})();
