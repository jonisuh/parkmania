(function(){
	angular
		.module('Parkmania')
		.controller('LoginCtrl', loginCtrl);

	loginCtrl.$inject = ['$location','authentication'];
	function loginCtrl($location, authentication){
console.log("login test");
		var vm = this;
		vm.pageHeader = {
			title: 'Sign in'
		};

		vm.credentials = {
			email : "",
			password : ""
		};

		vm.returnPage = $location.search().page || '/';

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
					$location.search('page', null);
					$location.path(vm.returnPage);
				});
		}
	}
}) ();	