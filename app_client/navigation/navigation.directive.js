(function () {

  angular
    .module('Parkmania')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '/navigation/navigation.template.html',
      controller: 'NavigationCtrl',
      controllerAs : 'navvm'
    };
  }

})();