
(function () {

  angular
    .module('Parkmania')
    .service('location', location);

  function location (){

    var getLocation = function (successcallback, errorcallback) {

      var ua = navigator.userAgent.toLowerCase();
      isAndroid = ua.indexOf("android") > -1,
      geoTimeout = isAndroid ? '20000' : '10000';

      if (navigator.geolocation) {

        //Dummy one, which will result in a working next statement.
        navigator.geolocation.getCurrentPosition(function () {}, function () {}, {});
        //The working next statement.
        navigator.geolocation.getCurrentPosition(successcallback ,errorcallback, {
            enableHighAccuracy: true,
            timeout: geoTimeout
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