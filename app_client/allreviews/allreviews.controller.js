(function(){
	angular
		.module('Parkmania')
		.controller('allReviewsController', allReviewsController);

	allReviewsController.$inject = ['$http','$resource','$uibModalInstance','spotId','authentication'];
	function allReviewsController($http,$resource,$uibModalInstance,spotId, authentication){
		var vm = this;

		$resource('/api/parkingspot/'+spotId).get(function(parkingspot){
			vm.parkingspot = parkingspot;

			for(i in vm.parkingspot.reviews){
				timestamp = new Date(Date.parse(vm.parkingspot.reviews[i].time));
		        formattedTime = timestamp.getHours()+":"+timestamp.getMinutes()+" "+timestamp.getDate()+"."+(timestamp.getMonth()+1)+"."+timestamp.getFullYear();
		        vm.parkingspot.reviews[i].time = formattedTime;
			}
	    });


		vm.closeModal = function(){
			$uibModalInstance.dismiss('cancel');
		};
	}
}) ();	