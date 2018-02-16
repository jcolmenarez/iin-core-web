export const MSExcelImporterFormComponent = {
        templateUrl: 'js/app/components/ms-excel-importer/importer-form/importer-form.html',
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
