(function(){ 
  angular
    .module('Parkmania')
    .controller('NavigationCtrl', navigationCtrl);

  navigationCtrl.$inject = ['$location','$route', 'authentication'];
  function navigationCtrl($location,$route, authentication) {
    var vm = this;

    vm.currentPath = $location.path();
    vm.isLoggedIn = authentication.isLoggedIn();
    vm.currentUser = authentication.currentUser();


  }
})();