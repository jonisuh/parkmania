(function () {

  angular.module('Parkmania', ['ngResource','ngRoute'])
    .config(['$routeProvider', config]);


  function config($routeProvider){
    $routeProvider
        .when('/', {
		    templateUrl: '/home/home.view.html',
		    controller: 'HomeCtrl'
		})
		.when('/registration', {
	        templateUrl: '/auth/register/register.view.html',
	        controller: 'RegisterCtrl',
	        controllerAs: 'vm'
    	})
    	.when('/login', {
		  templateUrl: '/auth/login/login.view.html',
		  controller: 'LoginCtrl',
		  controllerAs: 'vm'
		})
        .otherwise({
            redirectTo: '/'
        });
}

})();