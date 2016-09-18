
(function () {

  angular
    .module('Parkmania')
    .controller('ParkingCtrl', parkingCtrl);

  parkingCtrl.$inject = ['$location','$route','parking'];
  function parkingCtrl ($location,$route,parking) {
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

  }

})();