
(function () {

  angular
    .module('Parkmania')
    .controller('HomeCtrl', homeCtrl);

  homeCtrl.$inject = ['$location','$route', 'authentication'];
  function homeCtrl ($location,$route, authentication) {
    var vm = this;

    //vm.currentPath = $location.path();

    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();

    vm.logout = function(){
      authentication.logout();
      $location.path("/");
      $route.reload();
    }
  }

})();