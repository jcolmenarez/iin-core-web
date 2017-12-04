import express, { Router } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import * as APIControllers from './api/api.controllers.BABEL_COMPILED.js';

const app = express();
const router = Router();

app.use(express.static(path.join(__dirname, 'www')));

app.use(bodyParser.urlencoded({'extended': true}));
app.use(bodyParser.json());

router.route('/event-enroll-student').post(APIControllers.enrollStudentInEvent);
router.route('/event-promotion-code').post(APIControllers.insertEventPromotionCode);

app.use('/api', router);

const server = app.listen(3000, () => {

      const { address, port } = server.address();

      console.log('IIN Core Web running on port ' + port);

    });
