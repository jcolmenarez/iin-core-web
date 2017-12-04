import { LoadingComponent } from './loading/loading.component.js';
import { CommonComponent } from './common.component.js';
import { HeaderComponent } from './header/header.component.js';
import { SideBarComponent } from './sidebar/sidebar.component.js';
import { FooterComponent } from './footer/footer.component.js';

export const CommonModule = angular.module('root.common', [])

        .component('loading', LoadingComponent)
        .component('common', CommonComponent)
        .component('mainHeader', HeaderComponent)
        .component('mainSidebar', SideBarComponent)
        .component('mainFooter', FooterComponent)

        .config(commonConfigBlock)

    .name;


// COMMON MODULE CONFIGURATION PHASE BLOCK
// Dependencies injection safe notation
commonConfigBlock.$inject = ['$stateProvider'];

// Module configuration block
function commonConfigBlock ($stateProvider){

    let rootState = {
            name: 'root',
            url: '',
            component: 'common',
            data: {
                requiredAuth: true
            },
            redirectTo: 'msExcelImporter' // ToDo: Replace with real default view when App grows
        };

    $stateProvider.state(rootState);

}
