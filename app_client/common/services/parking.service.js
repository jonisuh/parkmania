
(function () {

  angular
    .module('Parkmania')
    .service('parking', parking);

  parking.$inject = ['$http','$window'];
  function parking ($http, $window){

    var createParkingSpot = function(parking){
        console.log("parkingserv "+parking);
        return $http.post('/api/parkingspot', parking).success(function(data) {
          console.log(data.parkingspot);
        });
    };

    return {
      createParkingSpot : createParkingSpot
    };
  }

})();