const mssql = require('mssql'),
    config = {
        server: '10.10.30.22',
        database: 'IIN.QA',
        user: 'iin_javi',
        password: 'Password01',
        port: 1433
    };

export const enrollStudentInEvent = (req, res) => {

    console.log('Params passed to the API webservice =>', req.body);

    mssql.close();

    (async function (){

        try {

            let pool = await mssql.connect(req.body.dbConfig || config),
                result = await pool.request().query(`
                    exec dbo.InsertCourseEnrollment
                    @CourseId = '${req.body.courseId}',
                    @StudentId = '${req.body.studentId}',
                    @Status = 11,
                    @EnrollmentMethod = 6,
                    @EnrolledByEmployeeId = '1F1F2C13-21F6-41C1-8DE1-0FBEC511FB6B'
                `);

            console.log('Successful connection: ', result);
            res.json({data: result});

        } catch (err){

            console.log('Connection Error: ', err);
            res.status(400).json({data: err});

        }

    })();


    mssql.on('error', err => {

        console.log('Error handler: ', err);
        res.status(401).json({data: err});

    });

}

export const insertEventPromotionCode = (req, res) => {

    console.log('Params passed to the API webservice =>', req.body);

    mssql.close();

    (async function (){

        try {

            let pool = await mssql.connect(req.body.dbConfig || config),
                result = await pool.request().query(`
                    INSERT INTO AmiandoEventPromotionCode 
                    VALUES (NEWID(),'${req.body.eventId}', '${req.body.studentId}', '${req.body.promoCode}', ${req.body.activationCode})
                `);

            console.log('Successful connection: ', result);
            res.json({data: result});

        } catch (err){

            console.log('Connection Error: ', err);
            res.status(400).json({data: err});

        }

    })();


    mssql.on('error', err => {

        console.log('Error handler: ', err);
        res.status(401).json({data: err});

    });

}
