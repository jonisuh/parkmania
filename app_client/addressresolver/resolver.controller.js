(function(){
	angular
		.module('Parkmania')
		.controller('resolverController', resolverController);

	resolverController.$inject = ['$uibModalInstance'];
	function resolverController($uibModalInstance){
		var vm = this;
		vm.placeChanged = function() {
		    vm.place = this.getPlace();
		}

		vm.return = function() {
			console.log(vm.place);
			if(vm.place.geometry){
				addresscoords = vm.place.geometry.location.toJSON();
				console.log("returning "+addresscoords);
				$uibModalInstance.close(addresscoords);	
			}else{
				$uibModalInstance.dismiss('cancel');	
			}
		};

		
	}
}) ();	