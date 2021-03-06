(function(){
	angular
		.module('Parkmania')
		.controller('addReviewController', addReviewController);

	addReviewController.$inject = ['$http','$resource','$uibModalInstance', 'spotId','authentication'];
	function addReviewController($http,$resource,$uibModalInstance, spotId, authentication){
		var vm = this;
		vm.parkingspot;
		vm.rating = 0;
		vm.hourStep = 1;
		vm.minuteStep = 15;
		vm.reviewDate = new Date();

		vm.dateOptions = {
		    formatYear: 'yy',
		    maxDate: new Date(2020, 5, 22),
		    startingDay: 1
		  };
		$resource('/api/parkingspot/'+spotId).get(function(parkingspot){
			vm.parkingspot = parkingspot;
	    });

		vm.changeRating = function(newrating){
			vm.rating = parseInt(newrating);
		};

		vm.postReview = function(){
			if(!vm.rating){
            	vm.alertType = "danger";
				vm.alertText = "Please select a rating.";
			}else{
			
				review = {
					rating : vm.rating,
					description : vm.description,
					timestamp : vm.reviewDate
				};

				$http.post('/api/parkingspot/'+spotId+/review/, review, {
			        headers: {
			          Authorization: 'Bearer '+ authentication.getToken()
			        }
				}).success(function (data, status, headers, config) {
					vm.alertType = "success";
					vm.alertText = "Review added!";
					setTimeout(function(){ $uibModalInstance.close(true);	 }, 1500);
	            })
	            .error(function (data, status, header, config) {
	            	console.log(status);
	            	vm.alertType = "danger";
					vm.alertText = "Error while posting a review";
	            });
        	}
		};

		vm.openDatepicker = function(){
			vm.datePickerOpened = true;
		};
		
		vm.closeModal = function(){
			$uibModalInstance.dismiss('cancel');
		};
		
	}
}) ();	