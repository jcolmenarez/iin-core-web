export const SideBarComponent = {

        template: `
            <aside ng-if="$ctrl.isAuthenticated" class="main-sidebar"></aside>
        `,
        controller: SidebarController

    };


SidebarController.$inject = ['$window'];

function SidebarController ($window){

    const ctrl = this;

    this.$onInit = () => {

        ctrl.isAuthenticated = false;

    };

}