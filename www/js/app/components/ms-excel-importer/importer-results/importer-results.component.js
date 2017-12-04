export const MSExcelImporterResultsComponent = {
        template: `
            <section class="component-container" id="ms-excel-importer-results-container">

                <div class="loading-container" ng-show="$ctrl.isLoading">
                    <span>
                        <i class="fa fa-spinner fa-pulse fa-5x fa-fw"></i>
                        Loading...
                    </span>
                </div>

                <div class="results-container" ng-if="!$ctrl.isLoading && $ctrl.showingResults">

                    <p class="results-list-title">Results List:</p>
                    <ul>
                        <li ng-class="{
                                'pending': !result.isComplete,
                                'error': result.isComplete && result.isError,
                                'success': result.isComplete && !result.isError
                            }" ng-repeat="result in $ctrl.results">
                            <i ng-class="[
                                    'fa',
                                    'fa-li',
                                    {
                                        'fa-exclamation-circle': result.isComplete && result.isError,
                                        'fa-check-circle': result.isComplete && !result.isError,
                                        'fa-spinner fa-fw': !result.isComplete
                                    }
                                ]"></i>{{ result.message }}
                        </li>
                    </ul>

                    <a class="download-results-log" ng-href="{{ $ctrl.resultsList() }}" download="results-log.txt">
                        <i class="fa fa-arrow-down"></i>
                        Download results log file
                    </a>

                </div>

                <form id="db-config-form" ng-if="!$ctrl.isLoading && !$ctrl.showingResults">

                    <button class="btn btn-primary" id="update-db-config-btn" type="button" ng-click="$ctrl.shouldUpdateDBConfig()">
                        <i class="fa fa-database"></i>
                        {{ !$ctrl.dbConfigHasChanged ? 'Update DB Configuration' : 'Use default DB Configuration' }}
                    </button>

                    <div class="form-control-group" ng-show="$ctrl.dbConfigHasChanged" ng-repeat="(key, value) in $ctrl.dbNewConfig">

                        <label for="{{ key }}">{{ $ctrl.dbConfigFieldsInfo[key].name }}</label>
                        <input ng-model="$ctrl.dbNewConfig[key]" name="{{ key }}" placeholder="{{ $ctrl.dbConfigFieldsInfo[key].placeholder }}" type="{{ $ctrl.dbConfigFieldsInfo[key].type }}" />

                    </div>

                </form>

                <h3 ng-if="!$ctrl.isLoading && !$ctrl.showingResults">{{ ::$ctrl.title }}</h3>

                <table class="table table-striped" ng-if="!$ctrl.isLoading && !$ctrl.showingResults">

                    <thead>
                    
                        <th ng-if="$ctrl.isEventPromoCodeMode">Event IDs</th>
                        <th>Student IDs</th>
                        <th ng-if="$ctrl.isEventPromoCodeMode">Promo Codes</th>
                        <th ng-if="$ctrl.isEventPromoCodeMode">Activated</th>

                    </thead>
                    
                    <tbody>
                    
                        <tr ng-repeat="row in $ctrl.excelData">

                            <td ng-if="$ctrl.isEventPromoCodeMode">{{ ::row.EventId }}</td>
                            <td>{{ ::row.StudentId }}</td>
                            <td ng-if="$ctrl.isEventPromoCodeMode">{{ ::row.PromotionCode }}</td>
                            <td ng-if="$ctrl.isEventPromoCodeMode">{{ ::row.Activated }}</td>

                        </tr>

                    </tbody>

                </table>

                <button class="btn btn-upload" ng-click="$ctrl.submitExcelData()" ng-if="!$ctrl.isLoading && !$ctrl.showingResults" type="button">
                    <i class="fa fa-arrow-up"></i>
                    Submit Excel data
                </button>

            </section>
        `,
        controller: MSExcelImporterResultsController
    };


MSExcelImporterResultsController.$inject = ['$filter', '$stateParams', 'MSExcelImporterServices'];

function MSExcelImporterResultsController ($filter, $stateParams, MSExcelImporterServices){

    const ctrl = this;

    this.$onInit = () => {

        ctrl.title = 'Excel Sheet Importer Results';
        ctrl.excelData = $stateParams.excelData;
        ctrl.courseId = $stateParams.courseId;
        ctrl.isEventPromoCodeMode = $stateParams.isEventPromoCodeMode;
        ctrl.isLoading = false;
        ctrl.showingResults = false;
        ctrl.results = [];
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

        ctrl.isLoading = true;
        ctrl.showingResults = false;

        angular.forEach(ctrl.excelData, row => {

            let postData = {'studentId': row.StudentId};

            if (ctrl.isEventPromoCodeMode){

                postData['eventId'] = row.EventId;
                postData['promoCode'] = row.PromotionCode;
                postData['activationCode'] = row.Activated;

            } else {

                postData['courseId'] = ctrl.courseId;

            }

            if (ctrl.dbConfigHasChanged){

                postData['dbConfig'] = ctrl.dbNewConfig;

            }

            MSExcelImporterServices[ctrl.isEventPromoCodeMode ? 'insertEventPromotionCode' : 'enrollStudentInEvent'](postData).then(data => {

                let dateAndTimeInfo = $filter('date')(new Date(), 'MM/dd/yyyy @ HH:mm'),
                    initialMssg = ctrl.isEventPromoCodeMode ? 'The event promotion code insertion' : 'The event enrollment';

                ctrl.results.push({
                    'isError': false,
                    'message': `${dateAndTimeInfo}: ${initialMssg} for the student ${row.StudentId} has been successful!`
                });

                ctrl.isLoading = false;
                ctrl.showingResults = true;

            }).catch(error => {
                
                console.log('error from submitExcelData=>',error);
                
                let isErrorDefined = angular.isDefined(error.data) && error.data !== null,
                    err = isErrorDefined ? error.data.data : {'code': error.status, 'name': 'Undefined'},
                    dateAndTimeInfo = $filter('date')(new Date(), 'MM/dd/yyyy @ HH:mm'),
                    initialMssg = ctrl.isEventPromoCodeMode ? 'The event promotion code insertion' : 'The event enrollment',
                    errorMssg = !isErrorDefined ?
                        'Unknown error' :
                        angular.isUndefined(err.originalError.info) ? err.originalError.message : err.originalError.info.message;

                ctrl.results.push({
                    'isError': true,
                    'message': `${dateAndTimeInfo}: ${initialMssg} for the student ${row.StudentId} has failed due to the following reason: ${err.code} - ${err.name}: ${errorMssg}`
                });
                ctrl.isLoading = false;
                ctrl.showingResults = true;

            });

        });

    };

    this.resultsList = () => {

        let list = ['IIN CORE - Results Log File\n-----------------------------------------\n\n'];

        angular.forEach(ctrl.results, result => {
            list.push('- ' + result.message + '\n');
        });

        list = encodeURIComponent(list.join('\n\n'));

        return `data:text/plain;charset=utf-8,${list}`;

    };

}
