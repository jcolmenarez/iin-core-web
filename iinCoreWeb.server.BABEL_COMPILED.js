'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apiControllersBABEL_COMPILED = require('./api/api.controllers.BABEL_COMPILED.js');

var APIControllers = _interopRequireWildcard(_apiControllersBABEL_COMPILED);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var router = (0, _express.Router)();

app.use(_express2.default.static(_path2.default.join(__dirname, 'www')));

app.use(_bodyParser2.default.urlencoded({ 'extended': true }));
app.use(_bodyParser2.default.json());

router.route('/event-enroll-student').post(APIControllers.enrollStudentInEvent);
router.route('/event-promotion-code').post(APIControllers.insertEventPromotionCode);

app.use('/api', router);

var server = app.listen(3000, function () {
      var _server$address = server.address(),
          address = _server$address.address,
          port = _server$address.port;

      console.log('IIN Core Web running on port ' + port);
});
