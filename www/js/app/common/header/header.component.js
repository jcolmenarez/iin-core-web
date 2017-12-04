export const HeaderComponent = {

        template: `
            <header ng-class="['main-header', {'auth-layout': $ctrl.isAuthenticated}]">

                <figure>

                    <img src="img/iinLogoMed.png" />

                </figure>

                <h1>

                    IIN - CORE Web Services
                    </br>
                    <span>Remote access to IIN CORE tools</span>

                </h1>

            </header>
        `,
        controller: HeaderController

    };


HeaderController.$inject = ['$window'];

function HeaderController ($window){

    const ctrl = this;

    this.$onInit = () => {

        ctrl.isAuthenticated = false;

    };

}