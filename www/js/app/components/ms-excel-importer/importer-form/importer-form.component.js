export const MSExcelImporterFormComponent = {
        template: `
            <section class="component-container" id="ms-excel-importer-container">

                <h3 id="excel-importer-title">{{ ::$ctrl.title }}</h3>
                <form id="excel-importer-form">

                    <div class="form-check" id="event-promo-code-mode">
                        <label class="form-check-label" for="">
                            <input class="form-check-input" ng-model="$ctrl.isEventPromoCodeMode" type="checkbox" />
                            Use Event Promotion Code Mode
                        </label>
                    </div>

                    <label class="dropdown-label" for="course_id" ng-show="!$ctrl.isEventPromoCodeMode">Courses to enroll in</label>
                    <select class="form-control dropdown-field" name="course_id" ng-model="$ctrl.courseId" ng-show="!$ctrl.isEventPromoCodeMode" required>

                        <option ng-repeat="option in $ctrl.courses" ng-value="option.id">{{ option.name }}</option>

                    </select>

                    <p class="file-name" ng-hide="!$ctrl.fileToProcess">
                        <i class="fa fa-table"></i> {{ $ctrl.fileToProcess }}<br />
                        {{ '(' + $ctrl.resultingRows + ' students found)' }}
                    </p>

                    <label class="input-file-field">

                        <input class="form-control" name="file" onchange="angular.element(this).scope().$ctrl.loadFile(this)" type="file" required />

                        <span><i class="fa fa-file"></i>Select file to import</span>

                    </label>

                    <button class="btn btn-upload" ng-click="$ctrl.processFile()" ng-disabled="!$ctrl.buttonEnabled" type="button">
                        <i class="fa fa-gear"></i>Process Excel file
                    </button>

                </form>

            </section>
        `,
        controller: MSExcelImporterFormController
    };


MSExcelImporterFormController.$inject = ['$scope', '$state', 'XLSX'];

function MSExcelImporterFormController ($scope, $state, XLSX){

    const ctrl = this;

    this.$onInit = () => {

        ctrl.title = 'MS Excel Sheets Importer';
        ctrl.isEventPromoCodeMode = false;
        ctrl.selectedFile = null;
        ctrl.resultingRows = null;
        ctrl.excelData = null;
        ctrl.buttonEnabled = false;
        ctrl.fileToProcess = null;
        ctrl.courseId = null;
        ctrl.courses = [
            {'id': null, 'name': 'Select a course'},
            {'id': 'AE452B54-26F1-4663-A8A7-511D157C5337', 'name': 'Conference VIPs (April 2018)'}
        ];

    };

    this.loadFile = el => {

        $scope.$apply(() => {

            ctrl.selectedFile = el.files[0];
            ctrl.buttonEnabled = true;
            ctrl.fileToProcess = el.files[0].name;

            readFile(ctrl.selectedFile, rows => {

                $scope.$apply(() => {
                    ctrl.resultingRows = rows.length;
                    ctrl.excelData = rows;
                });

            });

        });

    };

    this.processFile = () => {

        if (ctrl.excelData && ctrl.excelData !== null){ showResults(); }

        readFile(ctrl.selectedFile, rows => {

            if (rows.length > 0){ showResults(rows); }

        });

    };

    const readFile = (file, cb) => {

        if (file){

            let reader = new FileReader();

            reader.onload = evt => {

                let data = evt.target.result,
                    workbook = XLSX.read(data, {type: 'binary'}),
                    firstSheetName = workbook.SheetNames[0],
                    excelData = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]);

                if (cb){ cb(excelData); }

            };

            reader.readAsBinaryString(file);

        }

    };

    const showResults = (rows) => {
        
        $state.go('msExcelImporterResults', {
            courseId: ctrl.courseId,
            excelData: rows || ctrl.excelData,
            isEventPromoCodeMode: ctrl.isEventPromoCodeMode
        });

    };

}
