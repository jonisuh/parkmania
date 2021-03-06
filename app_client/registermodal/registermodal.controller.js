(function(){
	angular
		.module('Parkmania')
		.controller('registerModalController', registerModalController);

	registerModalController.$inject = ['authentication', '$uibModalInstance'];
	function registerModalController(authentication, $uibModalInstance){
		
		var vm = this;
		vm.pageHeader = {
			title: 'Create a new account'
		};

		vm.credentials = {
			name : "",
			email : "",
			password : ""
		};
		vm.modal = {
			cancel : function() {
				$uibModalInstance.dismiss('cancel');
			}
		};

		vm.onSubmit = function() {
			vm.formError = "";
			if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password){
				vm.formError = "All fields required, please try again";
				return false;		
			}else{
				vm.doRegister();
			}
		};
		vm.doRegister = function(){
			vm.formError ="";
			authentication
				.register(vm.credentials)
				.error(function(err){
					vm.formError = err;
				})
				.then(function(){
					$('.navbar-collapse').collapse('hide')
					vm.modal.cancel();
				});
		}
	}
}) ();	