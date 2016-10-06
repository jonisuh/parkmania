
(function () {

  angular
    .module('Parkmania')
    .controller('HomeCtrl', homeCtrl);

  homeCtrl.$inject = ['$http','$location','$resource','$route','$scope','$uibModal', 'authentication','location','NgMap'];
  function homeCtrl ($http, $location,$resource,$route,$scope,$uibModal,authentication, location, NgMap) {
    
    var vm = this;
    var map;
    var geocoder = new google.maps.Geocoder;
    NgMap.getMap().then(function(evtMap) {
      map = evtMap;

      vm.showAll();
    });

    vm.logout = function(){
      authentication.logout();
      vm.checkLoggedIn();
      $('.navbar-collapse').collapse('hide')
    };
    
    vm.showAll = function(){
      vm.parkingspots = [];
      latlng = new google.maps.LatLng(60.16985569999999, 24.93837899999994);

      vm.searchRadius = 0;
      vm.circleCenter = latlng;

      map.setCenter(latlng);
      map.setZoom(10);
      $resource('/api/parkingspot/all').query(function(parkingspots){
        vm.parkingspots = parkingspots;
      });
    };

    vm.mapClick = function(event) {
      map.hideInfoWindow('info');
      if(vm.reviewSelection === true){
        vm.selectedCoordinates = event.latLng;
        $resource('/api/parkingspot?lng='+event.latLng.lng()+'&lat='+event.latLng.lat()+'&maxdist=50&results=1').query(function(parkingspots){
          
          if(parkingspots[0]){
            vm.reviewSelection = false;
            vm.openReviewModal(parkingspots[0]._id);
          }else{
            map.showInfoWindow('newSpotInfo',event.latLng);
          }
        });

      }
    };

    vm.createNewSpot = function(){
      vm.reviewSelection = false;
      if(vm.selectedCoordinates){
        geocoder.geocode({'location': vm.selectedCoordinates}, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              
              newspot = {
                address : results[0].formatted_address,
                lng : vm.selectedCoordinates.lng(),
                lat : vm.selectedCoordinates.lat()
              }; 

              $http.post('/api/parkingspot/', newspot, {
                headers: {
                  Authorization: 'Bearer '+ authentication.getToken()
                }
              }).success(function (data, status, headers, config) {
                vm.parkingspots[vm.parkingspots.length] = data;
                map.hideInfoWindow('newSpotInfo');
                vm.openReviewModal(data._id);

              }).error(function (data, status, header, config) {
                console.log(status);
                vm.errorText = "Error while posting a review";
              });
            } else {
              //window.alert('No results found');
            }
          } else {
            //window.alert('Geocoder failed due to: ' + status);
          }
        });

        
      }
    };


    vm.closeNewSpotInfo = function(){
      map.hideInfoWindow('newSpotInfo');
    };


    vm.nearCurrentLocation = function(){
      vm.parkingspots = [];
      location.getLocation(vm.locationsuccess, vm.locationerror);
    };

    vm.locationsuccess = function(position){
      latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(latlng);
      vm.searchRadius = 300;
      vm.circleCenter = latlng;
      map.setZoom(14);
      $resource('/api/parkingspot?lng='+position.coords.longitude+'&lat='+position.coords.latitude+'&maxdist='+vm.searchRadius+'&results=5').query(function(parkingspots){
        vm.parkingspots = parkingspots;
      });
    };
    
    vm.findNearAddress = function(location){
      vm.parkingspots = [];
      latlng = new google.maps.LatLng(location.lat, location.lng);
      map.setCenter(latlng);

      vm.searchRadius = 300;
      vm.circleCenter = latlng;

      map.setZoom(15);
      $resource('/api/parkingspot?lng='+location.lng+'&lat='+location.lat+'&maxdist='+vm.searchRadius+'&results=10').query(function(parkingspots){
        vm.parkingspots = parkingspots;
      });
    };

    vm.locationerror = function(error){
      vm.alerts = [];
      vm.formError = "Error code: "+error.code+"\n"+error.message;
      vm.alerts.push({type: 'danger', msg: 'Error:'+error.code+'\n'+error.message});
      $scope.$apply();
    };

    vm.showLoginModal = function(){
      var modalInstance = $uibModal.open({
       templateUrl: '/loginmodal/loginmodal.view.html',
       controller: 'loginModalController as vm',
      });

      modalInstance.closed.then(function () {
        vm.checkLoggedIn();
      });

    };

  vm.showRegisterModal = function(){
      var modalInstance = $uibModal.open({
       templateUrl: '/registermodal/registermodal.view.html',
       controller: 'registerModalController as vm',
      });

      modalInstance.closed.then(function () {
        vm.checkLoggedIn();
      });

    };


    vm.showResolverModal = function(){
      var resolverModal = $uibModal.open({
       templateUrl: '/addressresolver/resolver.view.html',
       controller: 'resolverController as vm'
      });

      resolverModal.result.then(function (addresscoords) {
        console.log(addresscoords);
        if(addresscoords.lat && addresscoords.lng){
          vm.findNearAddress(addresscoords);
        }
      });

    };

    vm.checkLoggedIn = function(){
      vm.isLoggedIn = authentication.isLoggedIn();
      vm.currentUser = authentication.currentUser();
    };

    vm.showInfoWindow= function(evt) {
      vm.clickedMarkerId = this.id;
      if(vm.reviewSelection === true){
        vm.reviewSelection = false;
        vm.openReviewModal(this.id);
      }else{
        $resource('/api/parkingspot/:id', {id: '@_id'}).get({ id: this.id}, function(parkingspot){
          vm.infoParkingSpot = parkingspot;
          vm.createRatingList(vm.infoParkingSpot.reviews);
        });

        map.showInfoWindow('info',this.id);
      }
    };

    vm.createRatingList = function(reviews){
      vm.ratingList = {};
      for(i in reviews){
        timestamp = new Date(Date.parse(reviews[i].time));
        timestamphours = timestamp.getHours();

        if(timestamphours % 2 !== 0){
          timestamphours -= 1;
        }

        if(!vm.ratingList[timestamphours]){
          vm.ratingList[timestamphours] = [];
        }
        vm.ratingList[timestamphours].push(reviews[i].rating);
      }

      averageRatings = [];
      for(k in vm.ratingList){
        ratingTotal = 0;
        for(e in vm.ratingList[k]){
          ratingTotal += vm.ratingList[k][e];
        }
        aveRating = ratingTotal / vm.ratingList[k].length;
        averageRatings[k] = aveRating;
      }

      vm.ratingList = [];
      //Setting current time as the default selected time
      //----
      currentTime = new Date();
      currentTimeHours = currentTime.getHours();
      if(currentTimeHours % 2 !== 0){
        currentTimeHours -= 1;
      }
      //----
      for (j = 0; j < 24; j+=2) {

        if(averageRatings.hasOwnProperty(j)){
          time = {
            timespan : j+"-"+(j+2),
            rating : averageRatings[j]
          }
        }else{
          time = {
            timespan : j+"-"+(j+2),
            rating : "No ratings yet."
          }
        }
        vm.ratingList.push(time);
        if(j === currentTimeHours){
          vm.infoTimeSelect = time.timespan;
        }
      }
      vm.timeSelectChange();
    };

    vm.timeSelectChange = function(){
      for(i in vm.ratingList){
        if(vm.infoTimeSelect === vm.ratingList[i].timespan){
          vm.infoCurrentRating = vm.ratingList[i].rating;
        }
      }
    };

    vm.addReview = function(id){
      vm.searchRadius = 0;
      map.hideInfoWindow('info');
      map.hideInfoWindow('newSpotInfo');
      vm.reviewAdd = true;
      if(id){
        vm.openReviewModal(id);
      }else{
        vm.reviewSelection = true;
      }
    }

    vm.openReviewModal = function(id){
      var reviewModal = $uibModal.open({
         templateUrl: '/reviewmodal/review.view.html',
         controller: 'addReviewController as vm',
         resolve: {
         spotId: function () {
           return id;
           }
         }
        });

        reviewModal.result.then(function () {
          console.log(addresscoords);
          if(addresscoords.lat && addresscoords.lng){
            vm.findNearAddress(addresscoords);
          }
        });
    }



    vm.closeAlert = function(index) {
      vm.alerts.splice(index, 1);
    };

    vm.checkLoggedIn();

    if(!vm.isLoggedIn){
      vm.showLoginModal();
    }



  }


})();