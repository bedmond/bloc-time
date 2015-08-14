// Initial attempt at creating a Start button that triggers
// a timer counting down from 25:00 to O minutes and resets
// to 25:00 after Reset is triggered.
// Repurposed code from BlocJams.

blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);

blocTime.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });
}]);

blocTime.controller('Home.controller', ['$scope', '$firebase', function($scope, $firebase) {
  var myDataRef = new Firebase('https://flickering-fire-4277.firebaseio.com/');
  $scope.data = $firebase(ref);
  $scope.toggleText = "Start";
}]);

blocTime.directive('home', ['$interval', function($interval) {
  return {
    templateUrl: '/templates/home.html',
    restrict: 'E',
    scope: true,
    link: function(scope, element, attributes) {
      scope.watch = 1500;
      scope.toggleText = "Start";
      // add Break toggle here.
      var countdown = function() {
        scope.watch--;
      }
      scope.toggleTextClicked = function() {
        if (scope.toggleText === "Start") {
          scope.toggleText = "Reset";
          scope.interval = $interval(countdown, 1000);
        } else {
          scope.toggleText = "Start";
          $interval.cancel(scope.interval);
          scope,watch = 1500;
        }
      }
    }
  }
}]);

blocTime.filter('timecode', function() {
  return function(seconds) {
    seconds = Number.parseFloat(seconds);

    // Returned when no time is provided.
    if (Number.isNaN(seconds)) {
      return '--:--';
    }

    // Make it a whole number.
    var wholeSeconds = Math.floor(seconds);

    var minutes = Math.floor(wholeSeconds / 60);

    var remainingSeconds = wholeSeconds % 60;

    var output = minutes + ':';

    // Zero pad seconds, so 9 seconds should be :09.
    if (remainingSeconds < 10) {
      output += '0';
    }

    output += remainingSeconds;

    return output;
  }
});