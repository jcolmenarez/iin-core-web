export const MSExcelImporterResultsComponent = {
        templateUrl: 'js/app/components/ms-excel-importer/importer-results/importer-results.html',
        controller: MSExcelImporterResultsController
    };


MSExcelImporterResultsController.$inject = ['$filter', '$state', '$stateParams', 'MSExcelImporterServices'];

function MSExcelImporterResultsController ($filter, $state, $stateParams, MSExcelImporterServices){

    const ctrl = this;

    let failedPositionsArray = [];

    this.$onInit = () => {

        ctrl.title = 'MS Excel Sheet Importer Results';
        ctrl.excelData = $stateParams.excelData;
        ctrl.courseId = $stateParams.courseId;
        ctrl.isEventPromoCodeMode = $stateParams.isEventPromoCodeMode;
        ctrl.showingSummaryTable = false;
        ctrl.summaryTableLabel = 'General';
        ctrl.summaryTableData = [];
        ctrl.isProcessingCompleted = false;
        ctrl.submissionCancelled = false;
        ctrl.showingResults = false;
        ctrl.results = {};
        ctrl.successfulRegisters = [];
        ctrl.failedRegisters = [];
        ctrl.registersInProcess = ctrl.excelData.length;
        ctrl.dbConfigHasChanged = false;
        ctrl.dbNewConfig = {
            server: null,
            port: null,
            database: null,
            user: null,
            password: null
        };
        ctrl.dbConfigFieldsInfo = {
            server: {
                name: 'Server IP Address',
                placeholder: 'i.e. 10.10.30.22',
                type: 'text'
            },
            port: {
                name: 'Server Port',
                placeholder: 'i.e. 1433',
                type: 'text'
            },
            database: {
                name: 'Database Name',
                placeholder: 'i.e. IIN.DB',
                type: 'text'
            },
            user: {
                name: 'Username',
                placeholder: 'i.e. iin_username',
                type: 'text'
            },
            password: {
                name: 'Password',
                placeholder: null,
                type: 'password'
            }
        };

    };

    this.shouldUpdateDBConfig = () => {

        ctrl.dbConfigHasChanged = !ctrl.dbConfigHasChanged;

    };

    this.submitExcelData = () => {

        ctrl.showingResults = true;

        angular.forEach(ctrl.excelData, row => {

            // Setting the initial state of the query in the results list that will be properly updated with the server response
            let initialMssg = ctrl.isEventPromoCodeMode ? 'Event promotion code insertion' : 'Event enrollment';
            ctrl.results[row.StudentId] = {
                'isComplete': false,
                'isError': false,
                'isQuerying': 'Not yet',
                'messages': [
                    `${initialMssg} for ${row.StudentId}:`,
                    `${dateAndTimeInfo()}: The request has been created.`
                ]
            };

        })

        processRow(0);

    };

    this.resultsList = () => {

        if ( !ctrl.isProcessingCompleted ) return false;

        let list = ['IIN CORE - Results Log File\n-----------------------------------------\n\n'];

        angular.forEach(ctrl.results, result => {
            let mssgs = result.messages.join('\n')
            list.push('- ' + mssgs + '\n');
        });

        list = encodeURIComponent(list.join('\n\n'));

        return `data:text/plain;charset=utf-8,${list}`;

    };

    this.updateSummary = type => {

        ctrl.showingSummaryTable = type !== 'General';
        ctrl.summaryTableLabel = type;
        ctrl.summaryTableData = type !== 'General' ? (type === 'Failed' ? ctrl.failedRegisters : ctrl.successfulRegisters) : [];

    };

    this.startAgain = () => {

        failedPositionsArray = [];
        failedPositionsArray.length = 0;
        ctrl.summaryTableData = [];
        ctrl.summaryTableData.length = 0;
        ctrl.isProcessingCompleted = false;
        ctrl.submissionCancelled = false;
        ctrl.showingResults = false;
        ctrl.results = {};
        ctrl.successfulRegisters = [];
        ctrl.successfulRegisters.length = 0;
        ctrl.failedRegisters = [];
        ctrl.failedRegisters.length = 0;
        ctrl.registersInProcess = 0;
        ctrl.dbConfigHasChanged = false;
        ctrl.dbNewConfig = {
            server: null,
            port: null,
            database: null,
            user: null,
            password: null
        };

        $state.go('msExcelImporter');

    };

    this.cancelSubmission = () => {

        ctrl.submissionCancelled = true;
        ctrl.isProcessingCompleted = true;

    };

    this.retryFailedAndUnprocessed = () => {

        ctrl.submissionCancelled = false;
        ctrl.isProcessingCompleted = false;

        if (ctrl.failedRegisters.length > 0){

            ctrl.registersInProcess += ctrl.failedRegisters.length;

            angular.forEach(ctrl.failedRegisters, fail => {

                ctrl.results[fail.StudentId].isComplete = false;
                ctrl.results[fail.StudentId].isError = false;
                ctrl.results[fail.StudentId].isQuerying = 'Not yet';
                failedPositionsArray.push(fail.query - 1);

            });

            ctrl.failedRegisters = [];
            ctrl.failedRegisters.length = 0;
            processRow(failedPositionsArray[0], true);

        } else if (ctrl.registersInProcess > 0){

            processRow(ctrl.excelData.length - ctrl.registersInProcess);

        }

    };

    
    const dateAndTimeInfo = () => {

        return $filter('date')(new Date(), 'MM/dd/yyyy @ HH:mm');

    };

    const decidingToProcessAnotherRow = (n, fromList) => {

        if ( angular.isDefined(fromList) ){

            failedPositionsArray.shift();
            
            if ( failedPositionsArray.length >= 1 ){

                processRow(failedPositionsArray[0], true);

            } else if ( ctrl.registersInProcess == 0 ){

                failedPositionsArray = [];
                failedPositionsArray.length = 0;
                ctrl.isProcessingCompleted = true;

            } else {

                processRow(ctrl.excelData.length - ctrl.registersInProcess);

            }

        } else if ( !ctrl.isProcessingCompleted && ctrl.excelData.length > (n + 1) ){

            processRow(n + 1);

        } else {

            ctrl.isProcessingCompleted = true;

        }

    };

    const processRow = (n, fromList) => {

        // Preparing the POST data
        let row = ctrl.excelData[n],
            postData = {'studentId': row.StudentId},
            initialMssg = ctrl.isEventPromoCodeMode ? 'The event promotion code insertion' : 'The event enrollment';

        ctrl.results[row.StudentId].isQuerying = 'Yes';
        ctrl.results[row.StudentId].messages.push(`
            ${dateAndTimeInfo()}: The database query has been started.
        `);

        if (ctrl.isEventPromoCodeMode){

            postData['eventId'] = row.EventId;
            postData['promoCode'] = row.PromotionCode;
            postData['activationCode'] = row.Activated;

        } else {

            postData['courseId'] = ctrl.courseId;

        }

        // Customizing the DB connection configuration info if requested
        if (ctrl.dbConfigHasChanged){

            let dbConfig = angular.copy(ctrl.dbNewConfig);
            dbConfig['stream'] = true;
            postData['dbConfig'] = dbConfig;

        }

        MSExcelImporterServices[ctrl.isEventPromoCodeMode ? 'insertEventPromotionCode' : 'enrollStudentInEvent'](postData).then(data => {

            let customizedRow = row;
            customizedRow['query'] = n + 1;
            ctrl.successfulRegisters.push(customizedRow);
            ctrl.registersInProcess--;

            ctrl.results[row.StudentId].isComplete = true;
            ctrl.results[row.StudentId].isError = false;
            ctrl.results[row.StudentId].isQuerying = 'Not anymore';
            ctrl.results[row.StudentId].messages.push(`
                ${dateAndTimeInfo()}: The request has been successfully completed.
            `);

            decidingToProcessAnotherRow(n, fromList);

        }).catch(error => {
            
            console.log('error from submitExcelData=>',error);
            
            let isErrorDefined = angular.isDefined(error.data) && error.data !== null && angular.isDefined(error.data.data) && error.data.data !== null,
                err = isErrorDefined ? error.data.data : {'code': error.status, 'name': 'Undefined'},
                errorMssg = !isErrorDefined || angular.isUndefined(err.originalError) ?
                    'Unknown error' :
                    angular.isUndefined(err.originalError.info) ? err.originalError.message : err.originalError.info.message;

            let customizedRow = row;
            customizedRow['query'] = n + 1;
            customizedRow['error'] = `${err.code} - ${err.name}: ${errorMssg}`;
            ctrl.failedRegisters.push(customizedRow);
            ctrl.registersInProcess--;

            ctrl.results[row.StudentId].isComplete = true;
            ctrl.results[row.StudentId].isError = true;
            ctrl.results[row.StudentId].isQuerying = 'Not anymore';
            ctrl.results[row.StudentId].messages.push(`
                ${dateAndTimeInfo()}: The request has failed due to the following reason: 
                ${err.code} - ${err.name}: ${errorMssg}
            `);

            decidingToProcessAnotherRow(n, fromList);

        });

    };

}
