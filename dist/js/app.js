// Initial attempt at creating a Start button that triggers
// a timer counting down from 25:00 to O minutes and resets
// to 25:00 after Reset is triggered.
// Repurposed code from BlocJams.

blocTime = angular.module('BlocTime', ['ui.router']);

blocTime.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });
}]);

blocTime.controller('Home.controller', ['$scope', '$interval', '$filter', function($scope, $interval, $filter) {
  
  var promise;

  var onBreak = false;

  var workSession = 25 * 60;

  var breakSession = 5 * 60;
  
  $scope.title = "Bloc Time";
  $scope.time = 25 * 60;
  $scope.toggleName = "Start";

  $scope.start = function() {
    // Make sure there aren't two countdowns happening
    $scope.stop();
    promise = $interval(countDown, 1000);
  }

  $scope.stop = function() {
    $interval.cancel(promise);
  }

  var countDown = function() {
    $scope.time -= 1;
    $scope.toggleName = "Reset";
    if ($scope.time == 0) {
      $scope.stop();
    }
  }

  $scope.updateTimer = function() {
    if ($scope.toggleName === "Reset") {
      $scope.stop();
      $scope.time = workSession;
      $scope.toggleName = "Start";
    }
    else {
      $scope.start();
    }
  }

}]);


  // added Bloc Jams filter
blocTime.filter('remainingTime', function() {
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