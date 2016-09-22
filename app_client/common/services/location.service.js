
(function () {

  angular
    .module('Parkmania')
    .service('location', location);

  function location (){

    var getLocation = function (successcallback) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successcallback, errorAlert, {
          enableHighAccuracy: true,
          timeout : 15000,
          maximumAge: 3000
        });
      }
      else {
        alert("Geolocation not enabled");
      }
    };

    errorAlert = function(error){
      alert(error.code+" \n"+error.message);
    };

    return {
      getLocation : getLocation
    };
  }

})();