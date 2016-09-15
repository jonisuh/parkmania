
(function () {

  angular
    .module('Parkmania')
    .controller('HomeCtrl', homeCtrl);

  homeCtrl.$inject = ['$scope', '$resource'];
  function homeCtrl ($scope, $resource ) {
    console.log("home");
  }

})();