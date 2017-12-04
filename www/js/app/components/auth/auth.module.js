import { LoginComponent } from './login/login.component.js';

export const AuthModule = angular.module('auth', [

        'ui.router'

    ]).component('login', LoginComponent).config(authConfigBlock).name;


authConfigBlock.$inject = ['$stateProvider'];

function authConfigBlock ($stateProvider){
    
    let loginState = {
            parent: 'root',
            name: 'login',
            url: '/login',
            component: 'login'
        };

    $stateProvider.state(loginState);

}
