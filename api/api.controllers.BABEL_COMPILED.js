'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var mssql = require('mssql'),
    config = {
    server: '10.10.30.22',
    database: 'IIN.QA',
    user: 'iin_javi',
    password: 'Password01',
    port: 1433,
    stream: true
};

mssql.on('error', function (err) {

    console.log('Global error handler: ', err);
    // res.status(401).json({data: err});
});

var enrollStudentInEvent = exports.enrollStudentInEvent = function enrollStudentInEvent(req, res) {

    console.log('Params passed to the API webservice =>', req.body);

    (async function () {

        try {

            var pool = await mssql.connect(req.body.dbConfig || config),
                result = await pool.request().query('\n                    exec dbo.InsertCourseEnrollment\n                    @CourseId = \'' + req.body.courseId + '\',\n                    @StudentId = \'' + req.body.studentId + '\',\n                    @Status = 11,\n                    @EnrollmentMethod = 6,\n                    @EnrolledByEmployeeId = \'1F1F2C13-21F6-41C1-8DE1-0FBEC511FB6B\'\n                ');

            console.log('Successful connection: ', result);
            (async function () {
                try {
                    mssql.close();
                } catch (err) {
                    console.log('Closing error!', err);
                }
            })();
            res.json({ data: result });
        } catch (err) {

            console.log('Connection Error: ', err);
            (async function () {
                try {
                    mssql.close();
                } catch (err) {
                    console.log('Closing error!', err);
                }
            })();
            res.status(400).json({ data: err });
        }
    })();
};

var insertEventPromotionCode = exports.insertEventPromotionCode = function insertEventPromotionCode(req, res) {

    console.log('Params passed to the API webservice =>', req.body);

    (async function () {

        try {

            var pool = await mssql.connect(req.body.dbConfig || config),
                result = await pool.request().query('\n                    INSERT INTO AmiandoEventPromotionCode \n                    VALUES (NEWID(),\'' + req.body.eventId + '\', \'' + req.body.studentId + '\', \'' + req.body.promoCode + '\', ' + req.body.activationCode + ')\n                ');

            console.log('Successful connection: ', result);
            (async function () {
                try {
                    mssql.close();
                } catch (err) {
                    console.log('Closing error!', err);
                }
            })();
            res.json({ data: result });
        } catch (err) {

            console.log('Connection Error: ', err);
            (async function () {
                try {
                    mssql.close();
                } catch (err) {
                    console.log('Closing error!', err);
                }
            })();
            res.status(400).json({ data: err });
        }
    })();
};
