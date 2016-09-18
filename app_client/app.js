(function () {

  angular.module('Parkmania', ['ngResource','ngRoute'])
    .config(['$routeProvider', '$locationProvider', config]);


  function config($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
		    templateUrl: '/home/home.view.html',
		    controller: 'HomeCtrl',
		    controllerAs : 'vm'
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
		.when('/review', {
		  templateUrl: '/review/review.view.html',
		  controller: 'ReviewCtrl',
		  controllerAs: 'vm'
		})
		.when('/parking', {
		  templateUrl: '/parking/parking.view.html',
		  controller: 'ParkingCtrl',
		  controllerAs: 'vm'
		})
        .otherwise({
            redirectTo: '/'
        });

        $locationProvider.html5Mode({
        	enabled : true,
        	requireBase: false
        });
}

})();