import { MSExcelImporterServices } from './ms-excel-importer.service.js';
import { MSExcelImporterFormComponent } from './importer-form/importer-form.component.js';
import { MSExcelImporterResultsComponent } from './importer-results/importer-results.component.js';

export const MSExcelImporterModule = angular.module('msExcelImporter', [

        'ui.router'

    ])
    
    .service('MSExcelImporterServices', MSExcelImporterServices)
    .component('msExcelImporterForm', MSExcelImporterFormComponent)
    .component('msExcelImporterResults', MSExcelImporterResultsComponent)
    .config(msExcelImporterConfigBlock)
    .constant('XLSX', XLSX)

    .name;


// MS EXCEL IMPORTER MODULE CONFIGURATION PHASE BLOCK
// Dependencies injection safe notation
msExcelImporterConfigBlock.$inject = ['$stateProvider'];

// Module configuration block
function msExcelImporterConfigBlock ($stateProvider){
    
    let msExcelImporterRootState = {
            parent: 'root',
            name: 'msExcelImporter',
            url: '/ms-excel-importer',
            component: 'msExcelImporterForm'
        },
        msExcelImporterResultsState = {
            parent: 'root',
            name: 'msExcelImporterResults',
            url: '/ms-excel-importer/results',
            component: 'msExcelImporterResults',
            params: {
                excelData: null,
                courseId: null,
                isEventPromoCodeMode: null
            }
        };

    $stateProvider.state(msExcelImporterRootState);
    $stateProvider.state(msExcelImporterResultsState);

}
