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

  $scope.title = "Bloc Time";
  $scope.toggleName = "Start";
  $scope.toggleTime = 25 * 60;
  $scope.timerSet = null;
  $scope.onBreak = false;

  $scope.countDown = function() {
    $scope.toggleTime -= 100; // speeded up countdown for testing.
    $scope.toggleName = "Reset";
    if ($scope.toggleTime == 0) {
      $scope.stop();
      $scope.timerSet = null;
      if ($scope.onBreak) {
        $scope.setWorkTime();
      } else {
        $scope.setShortBreak();
      }
    }    
  };
  // Add reset for short break timer.
  $scope.updateTimer = function() {
    if ($scope.toggleName === "Reset") {
      $scope.stop();
      $scope.toggleTime = 25 * 60;
      $scope.toggleName = "Start";
    } else {
      $scope.start();
    }
  }
  
  $scope.start = function() {
    $scope.timerSet = $interval($scope.countDown, 1000);
  }

  $scope.stop = function() {
    $interval.cancel($scope.timerSet);
  }

  $scope.setShortBreak = function() {
    $scope.onBreak = true;
    $scope.toggleTime = 5 * 60;
    $scope.toggleName = "Short Break";
  }

  $scope.setWorkTime = function() {
    $scope.onBreak = false;
    $scope.toggleTime = 25 * 60;
    $scope.toggleName = "Start";
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