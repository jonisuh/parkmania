
(function () {

  angular
    .module('Parkmania')
    .service('location', location);

  function location (){

    var getLocation = function (successcallback) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successcallback);
      }
      else {
        alert("Geolocation not enabled");
      }
    };

    return {
      getLocation : getLocation
    };
  }

})();