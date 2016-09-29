
(function () {

  angular
    .module('Parkmania')
    .controller('HomeCtrl', homeCtrl);

  homeCtrl.$inject = ['$location','$resource','$route','$scope','$uibModal', 'authentication','location','NgMap'];
  function homeCtrl ($location,$resource,$route,$scope,$uibModal,authentication, location, NgMap) {
    
    var vm = this;
    var map;
    NgMap.getMap().then(function(evtMap) {
      map = evtMap;

      vm.showAll();
    });

  /*
    vm.isLoggedIn = authentication.isLoggedIn();

    vm.currentUser = authentication.currentUser();
    */
    /*
    Parkingspots.query(function(parkingspots){
      vm.parkingspots = parkingspots;
    });
    */


    vm.logout = function(){
      authentication.logout();
      vm.checkLoggedIn();
    }
    
    vm.showAll = function(){
      vm.parkingspots = [];
      latlng = new google.maps.LatLng(60.16985569999999, 24.93837899999994);
      map.setCenter(latlng);
      map.setZoom(10);
      $resource('/api/parkingspot/all').query(function(parkingspots){
        vm.parkingspots = parkingspots;
      });
    }

    vm.nearCurrentLocation = function(){
      vm.parkingspots = [];
      location.getLocation(vm.locationsuccess, vm.locationerror);
    }

    vm.locationsuccess = function(position){
      latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(latlng);
      map.setZoom(14);
      $resource('/api/parkingspot?lng=24.8033456&lat=60.2219203&maxdist=1&results=5').query(function(parkingspots){
        vm.parkingspots = parkingspots;
      });
    }
    
    vm.nearAddress = function(){

    }

    vm.locationerror = function(error){
      vm.formError = "Error code: "+error.code+"\n"+error.message;
      $scope.$apply();
    }

    vm.showLoginModal = function(){
      var modalInstance = $uibModal.open({
       templateUrl: '/loginmodal/loginmodal.view.html',
       controller: 'loginModalController as vm',
      });

      modalInstance.closed.then(function () {
        vm.checkLoggedIn();
      });

      modalInstance.opened.then(function () {
        alert("asd");
      });
    }

    vm.checkLoggedIn = function(){
      vm.isLoggedIn = authentication.isLoggedIn();
      vm.currentUser = authentication.currentUser();
    }

    vm.checkLoggedIn();

    if(!vm.isLoggedIn){
      vm.showLoginModal();
    }



  }


})();