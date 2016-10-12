
(function () {

  angular
    .module('Parkmania')
    .controller('HomeCtrl', homeCtrl);

  homeCtrl.$inject = ['$http','$window','$location','$resource','$route','$scope','$uibModal', 'authentication','location','NgMap'];
  function homeCtrl ($http, $window, $location,$resource,$route,$scope,$uibModal,authentication, location, NgMap) {
    //Forcing https
    if ($location.protocol() !== 'https') {
      $window.location.href = $location.absUrl().replace('http', 'https');
    }

    var vm = this;
    var map;
    var geocoder = new google.maps.Geocoder;
    NgMap.getMap().then(function(evtMap) {
      map = evtMap;
      vm.showAll();
      location.getLocation(vm.setUserLocationMarker, vm.locationerror);
    });

    vm.alertsVisible = false;
    vm.timeSelectionOptions = {};

    for (i = 0; i < 24; i+=2) {
      if(i < 10 && i != 8){
        vm.timeSelectionOptions[i] = 0+""+i+":00 - "+0+(i+2)+":00";
      }else if( i == 8){
        vm.timeSelectionOptions[i] = 0+""+i+":00 - "+(i+2)+":00";
      }else{
        vm.timeSelectionOptions[i] = i+":00 - "+(i+2)+":00";
      }
       
    }

    vm.logout = function(){
      authentication.logout();
      vm.checkLoggedIn();
      $('.navbar-collapse').collapse('hide')
    };

    vm.setUserLocationMarker = function(location){
      if(location){

       vm.userMarker = {
        coords : [location.coords.longitude, location.coords.latitude]
       }
       $scope.$apply();
       /*
       new google.maps.Marker({
        position:  new google.maps.LatLng(location.coords.latitude, location.coords.longitude),
        map: map,
        title: "Topmost Marker",
        zIndex: google.maps.Marker.MAX_ZINDEX + 1
      }); */

      }else{
        location.getLocation(vm.setUserLocationMarker, vm.locationerror);
      }
    };

    vm.hideAlerts = function(){
      vm.alertsVisible = false;
    };

    vm.showAll = function(){

      vm.parkingspots = [];
      vm.alertsVisible = false;
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
      map.hideInfoWindow('userinfo');
      vm.alertsVisible = false;
      if(vm.reviewSelection === true){
        vm.selectedCoordinates = event.latLng;
        $resource('/api/parkingspot?lng='+event.latLng.lng()+'&lat='+event.latLng.lat()+'&maxdist=50&results=1').query(function(parkingspots){
          
          if(parkingspots[0]){
            vm.reviewSelection = false;
            vm.openReviewModal(parkingspots[0]._id);
          }else{
            vm.reviewSelection = false;
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
      vm.reviewSelection = true;
      map.hideInfoWindow('newSpotInfo');
    };


    vm.nearCurrentLocation = function(){
      vm.alertsVisible = true;
      vm.alertContent = 'Finding location...';
      vm.parkingspots = [];
      location.getLocation(vm.locationsuccess, vm.locationerror);
    };

    vm.locationsuccess = function(position){
      vm.alertsVisible = false;
      latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      map.setCenter(latlng);
      vm.searchRadius = 300;
      vm.circleCenter = latlng;
      map.setZoom(15);

      vm.userMarker = {
        coords : [position.coords.longitude, position.coords.latitude]
       }

      $resource('/api/parkingspot?lng='+position.coords.longitude+'&lat='+position.coords.latitude+'&maxdist='+vm.searchRadius+'&results=5').query(function(parkingspots){
        vm.parkingspots = parkingspots;
        if(parkingspots.length == 0){
          vm.alertsVisible = true;
          vm.alertContent = 'No parkingspots found near your location.';
        }
      });
    };
    
    vm.findNearAddress = function(location){
      vm.parkingspots = [];
      latlng = new google.maps.LatLng(location.lat, location.lng);
      map.setCenter(latlng);

      vm.searchRadius = 300;
      vm.circleCenter = latlng;

      map.setZoom(15);

      $resource('/api/parkingspot?lng='+location.lng+'&lat='+location.lat+'&maxdist='+vm.searchRadius+'&results=5').query(function(parkingspots){
        vm.parkingspots = parkingspots;
        if(parkingspots.length == 0){
          vm.alertsVisible = true;
          vm.alertContent = 'No parking spots found near the address.'
        }
      });
    };

    vm.locationerror = function(error){
      vm.alertsVisible = true;
      vm.alertContent = 'The application could not determine your location.\nPlease check the GPS settings in your device.'
      $scope.$apply();
    };

    vm.showLoginModal = function(){
      var modalInstance = $uibModal.open({
       templateUrl: '/loginmodal/loginmodal.view.html',
       controller: 'loginModalController as vm',
      });

      modalInstance.closed.then(function () {
        vm.checkLoggedIn();
        if(vm.isLoggedIn){
          setTimeout(function(){
            google.maps.event.trigger(map, 'resize');
             vm.showAll();
          }, 1);
        }
      });

    };

  vm.showRegisterModal = function(){
      var modalInstance = $uibModal.open({
       templateUrl: '/registermodal/registermodal.view.html',
       controller: 'registerModalController as vm',
      });

      modalInstance.closed.then(function () {
        vm.checkLoggedIn();
         if(vm.isLoggedIn){
          setTimeout(function(){
           console.log(map);
              google.maps.event.trigger(map, 'resize');
              vm.showAll();
            }, 1);
          }
      });

    };


    vm.showResolverModal = function(){
      var resolverModal = $uibModal.open({
       templateUrl: '/addressresolver/resolver.view.html',
       controller: 'resolverController as vm'
      });

      resolverModal.result.then(function (addresscoords) {
        if(addresscoords.lat && addresscoords.lng){
          vm.findNearAddress(addresscoords);
        }
      });

    };

    vm.checkLoggedIn = function(){
      vm.isLoggedIn = authentication.isLoggedIn();
      vm.currentUser = authentication.currentUser();
    };

    vm.showUserInfoWindow = function(){
      map.showInfoWindow('userinfo',"user-marker");
    };

    vm.showInfoWindow= function(evt) {
      vm.clickedMarkerId = this.id;
      map.hideInfoWindow('userinfo');
      vm.alertsVisible = false;
      if(vm.reviewSelection === true){
        vm.reviewSelection = false;
        vm.openReviewModal(this.id);
      }else{
        $resource('/api/parkingspot/:id', {id: '@_id'}).get({ id: this.id}, function(parkingspot){
          vm.infoParkingSpot = parkingspot;
          vm.createRatingList(vm.infoParkingSpot.reviews);
          map.showInfoWindow('info',vm.clickedMarkerId);
        });

        //map.showInfoWindow('info',this.id);
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
        time = {
          timespan : "",
          rating : ""
        }

        if(averageRatings.hasOwnProperty(j)){
          time.rating = averageRatings[j];
        }else{
          time.rating = "No ratings yet.";
        }

        time.timespan = vm.timeSelectionOptions[j];

        vm.ratingList.push(time);
        if(j === currentTimeHours){
          vm.infoTimeSelect = time.timespan;
          vm.timeSelectionIndex = j;
        }
      }
      vm.timeSelectChange();
    };

    vm.previousTime = function(){
      vm.timeSelectionIndex -=2;
      if(vm.timeSelectionIndex < 0){
        vm.timeSelectionIndex = 22;
      }
      vm.infoTimeSelect = vm.timeSelectionOptions[vm.timeSelectionIndex];
      vm.timeSelectChange();
    };

    vm.nextTime = function(){
      vm.timeSelectionIndex +=2;
      if(vm.timeSelectionIndex > 22){
        vm.timeSelectionIndex = 0;
      }
      vm.infoTimeSelect = vm.timeSelectionOptions[vm.timeSelectionIndex];
      vm.timeSelectChange();
    };

    vm.timeSelectChange = function(){
      for(i in vm.ratingList){
        if(vm.infoTimeSelect === vm.ratingList[i].timespan){
          vm.infoCurrentRating = vm.ratingList[i].rating;
        }
      }


      selectedTimeSpan = vm.infoTimeSelect.split("-");
      selectedTimeSpan = {
        0 : parseInt(selectedTimeSpan[0].split(":")[0]),
        1 : parseInt(selectedTimeSpan[1].split(":")[0])
      }


      vm.newestReview = null;

      for(i in vm.infoParkingSpot.reviews){
        timestamp = new Date(Date.parse(vm.infoParkingSpot.reviews[i].time));

        if((timestamp.getHours() >= selectedTimeSpan[0]) && (timestamp.getHours() < selectedTimeSpan[1])){
          if(!vm.newestReview){
            vm.newestReview = vm.infoParkingSpot.reviews[i];
          }else{ 
            earliestReviewTime = new Date(Date.parse(vm.newestReview.time));
            if(timestamp.getTime() > earliestReviewTime.getTime()){
              vm.newestReview = vm.infoParkingSpot.reviews[i];
            }
          }
        }

      }

      if(vm.newestReview){
        timestamp = new Date(Date.parse(vm.newestReview.time));
        formattedTime = timestamp.getHours()+":"+timestamp.getMinutes()+" "+timestamp.getDate()+"."+(timestamp.getMonth()+1)+"."+timestamp.getFullYear();
        //vm.newestReview.time = formattedTime;

        tempReview = {
          _id : vm.newestReview._id,
          author: {
            _id: vm.newestReview.author._id,
            name : vm.newestReview.author.name
          },
          description : vm.newestReview.description,
          rating : parseInt(vm.newestReview.rating),
          time : formattedTime
        }
        vm.newestReview = tempReview;

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
        vm.alertsVisible = true;
        vm.alertContent = 'Please select a parkingspot to review.';
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

        reviewModal.result.then(function (success) {
          if(success){
            $resource('/api/parkingspot/:id', {id: '@_id'}).get({ id: id}, function(parkingspot){
            vm.infoParkingSpot = parkingspot;
            vm.createRatingList(vm.infoParkingSpot.reviews);
            map.showInfoWindow('info',vm.clickedMarkerId);
          });

          }
        });
    }

    vm.showAllReviews = function(){
      var allReviews = $uibModal.open({
       templateUrl: '/allreviews/allreviews.view.html',
       controller: 'allReviewsController as vm',
        resolve: {
         spotId: function () {
           return vm.infoParkingSpot._id;
           }
         }
      });
    };

    vm.checkLoggedIn();

    if(!vm.isLoggedIn){
      vm.showLoginModal();
    }



  }


})();