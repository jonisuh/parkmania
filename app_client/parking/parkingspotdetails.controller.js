
(function () {

  angular
    .module('Parkmania')
    .controller('ParkingspotDetailsCtrl', parkingspotDetailsCtrl);

  parkingspotDetailsCtrl.$inject = ['$scope','$resource','$location','$route','$routeParams', 'authentication'];
  function parkingspotDetailsCtrl ($scope, $resource, $location,$route,$routeParams, authentication) {
  	var vm = this;
 	var Parkingspot = $resource('/api/parkingspot/:id', {id: '@_id'});

	Parkingspot.get({ id: $routeParams.id }, function(parkingspot){
		vm.map = {
        center: {
                latitude: parkingspot.coords[1],
                longitude: parkingspot.coords[0]
        },
        zoom: 12
      };
      vm.marker = {
        id: 0,
        coords: {
          latitude: parkingspot.coords[1],
          longitude: parkingspot.coords[0]
        }
      };
	});
	

  }


})();