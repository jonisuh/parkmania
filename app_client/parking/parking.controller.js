
(function () {

  angular
    .module('Parkmania')
    .controller('ParkingCtrl', parkingCtrl);

  parkingCtrl.$inject = ['$scope','$location','$route','parking','location'];
  function parkingCtrl ($scope, $location,$route,parking,location) {
    var vm = this;

    vm.pageHeader = {
		title: 'Submit a parking spot'
	};
	
	vm.parking = {
		address : "",
		lng : "",
		lat : ""
	}; 

	vm.onSubmit = function() {
		vm.formError = "";
		if (!vm.parking.address || !vm.parking.lng || !vm.parking.lat ){
			vm.formError = "All fields required, please try again";
			return false;		
		}else{
			vm.addParkingSpot();
		}
	};

	vm.addParkingSpot = function(){
		console.log(vm.parking);
		parking.createParkingSpot(vm.parking);

	}

	vm.locationsuccess = function(position){
		vm.parking.lng = position.coords.longitude;
		vm.parking.lat = position.coords.latitude;
		$scope.$apply();
	}

	vm.locationerror = function(error){
		vm.formError = "Error code: "+error.code+"\n"+error.message;
		$scope.$apply();
	}

	location.getLocation(vm.locationsuccess, vm.locationerror);

  }

})();