
(function () {

  angular
    .module('Parkmania')
    .service('location', location);

  function location (){

    var getLocation = function (successcallback) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successcallback, errorAlert, {
          enableHighAccuracy: true,
          timeout : 5000,
          maximumAge: 0
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