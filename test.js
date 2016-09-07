
mainApplicationModule.run(function ($rootScope, AuthService, $state) {
    if(AuthService.checkUserRole()){
        $rootScope.chair = true;
        $rootScope.normalUser = false;
    } else {
        $rootScope.normalUser = true;
        $rootScope.chair = false;
    }
    if(AuthService.isLoggedIn()){
        $rootScope.currentUser = true;
    } else {
        $rootScope.currentUser = false;
    }
    $rootScope.$on('$stateChangeError', function(evt, to, toParams, from, fromParams, error) {
        evt.preventDefault();
        if (error.redirectTo) {
            $state.go(error.redirectTo);
        } else {
            $state.go('home')
        }
    })
});
angular.element(document).ready(function() {
    angular.bootstrap(document, [mainApplicationModuleName]);
});

$('#upload-btn').on('click', function (){
    $('#upload-input').click();
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
});
$('#upload-input').on('change', function(){
    console.log('on change happened for file');
});/**
 * Created by sufyjakate on 07/09/16.
 */
