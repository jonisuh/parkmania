
(function () {

  angular
    .module('Parkmania')
    .service('location', location);

  function location (){

    var getLocation = function (successcallback, errorcallback) {

      var ua = navigator.userAgent.toLowerCase();
      isAndroid = ua.indexOf("android") > -1,
      geoTimeout = isAndroid ? '30000' : '5000';

      //console.log(geoTimeout);

      if (navigator.geolocation) {
        /*
        navigator.geolocation.getCurrentPosition(successcallback, errorcallback, {
          enableHighAccuracy: true,
          timeout : geoTimeout,
          maximumAge: 0
        });
        */

        //Dummy one, which will result in a working next statement.
        navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
        //The working next statement.
        navigator.geolocation.getCurrentPosition(successcallback ,errorcallback, {
            enableHighAccuracy: true
        });





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