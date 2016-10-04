(function(){
	angular
		.module('Parkmania')
		.controller('loginModalController', loginModalController);

	loginModalController.$inject = ['authentication','$uibModalInstance'];
	function loginModalController(authentication,$uibModalInstance){

		var vm = this;
		vm.pageHeader = {
			title: 'Sign in'
		};

		vm.credentials = {
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
			if (!vm.credentials.email || !vm.credentials.password){
				vm.formError = "All fields required, please try again";
				alert("All fields required, please try again");
				return false;		
			}else{
				vm.doLogin();
			}
		};
		vm.doLogin = function(){
			vm.formError ="";
			authentication
				.login(vm.credentials)
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