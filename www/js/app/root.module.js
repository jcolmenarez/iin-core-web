import { RootComponent } from './root.component.js';
import { CommonModule } from './common/common.module.js';
import { ComponentsModule } from './components/components.module.js';

export const RootModule = angular.module('root', [

        'ui.router',
        CommonModule,
        ComponentsModule

    ])
    
    .component('root', RootComponent)
    .config(rootConfigBlock)
    .run(rootRunBlock)
    .name;


// ROOT MODULE CONFIGURATION PHASE BLOCK
// Dependencies injection safe notation
rootConfigBlock.$inject = ['$locationProvider', '$compileProvider'];

// Module configuration block
function rootConfigBlock ($locationProvider, $compileProvider){

    // Disabling the exclamation sign '!' for the URLs
    $locationProvider.hashPrefix('');
    // Enabling different types of URLs in the links via dynamic NG-HREF attributes
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob|data):/);

}


// ROOT MODULE RUN PHASE BLOCK
// Dependencies injection safe notation
rootRunBlock.$inject = ['$transitions'];

// Module run block
function rootRunBlock ($transitions){

    $transitions.onBefore({}, (transition) => {
        //console.log('$transitions.onBefore: ', transition);
    });

}