import { AuthModule } from './auth/auth.module.js';
import { MSExcelImporterModule } from './ms-excel-importer/ms-excel-importer.module.js';

export const ComponentsModule = angular.module('root.components', [

        AuthModule,
        MSExcelImporterModule

    ]).name;
