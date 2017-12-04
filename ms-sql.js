const mssql = require('mssql'),
    config = {
        server: '10.10.30.22',
        database: 'IIN.QA',
        user: 'iin_javi',
        password: 'Password01',
        port: 1433
    };


(async function (){

    try {

        let pool = await mssql.connect(config),
            result = await pool.request().query(`
                exec dbo.InsertCourseEnrollment
                @CourseId = 'AE452B54-26F1-4663-A8A7-511D157C5337',
                @StudentId = '1897B395-9ED9-4123-9BD4-024263CB0E1B',
                @Status = 11,
                @EnrollmentMethod = 6,
                @EnrolledByEmployeeId = '1F1F2C13-21F6-41C1-8DE1-0FBEC511FB6B'
            `);

        console.log('Successful connection: ', result);

    } catch (err){

        console.log('Connection Error: ', err);

    }

})();


mssql.on('error', err => {

    console.log('Error handler: ', err);

});
