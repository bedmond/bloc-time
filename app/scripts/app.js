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

//Set up constants for better maintainability.
blocTime.constant('APP_TIMERS', {
    'WORK_SESSION': 25 * 60,
    'SHORT_BREAK': 5 * 60,
    'LONG_BREAK': 30 * 60
  });

blocTime.controller('Home.controller', ['$scope', '$interval', 'APP_TIMERS', '$filter', function($scope, $interval, APP_TIMERS, $filter) {

  $scope.title = "Bloc Time";
  $scope.toggleName = "Start";
  $scope.toggleTime = APP_TIMERS.WORK_SESSION;
  $scope.onBreak = false;
  $scope.completedWorkSessions = 0;

  // Counts down if there is time on the counter.
  $scope.countDown = function() {
    $scope.toggleTime -= 100; // speeded up countdown for testing.
    $scope.toggleName = "Reset";
    if ($scope.toggleTime == 0) {
      $scope.stop();
      if ($scope.onBreak) {
        $scope.setWorkTime();
      } else {
        $scope.setShortBreak();
      }
      //if completedWorkSessions > 4,
      //where a completedWorkSession = a completed setWorkTime +
      //a completed setShortBreak, then initiate
      //setLongBreak function and show associated toggle.
    }    
  };
  // Activated when button is clicked.
  $scope.updateTimer = function() {
    if ($scope.toggleName === "Reset") {
      $scope.stop();
      if ($scope.onBreak) {
        $scope.setShortBreak();    
      } else {
        $scope.setWorkTime();
      }
      //if on setLongBreak();
    } else {
      $scope.start();
      $scope.toggleName = "Reset";
    }
  };
  
  $scope.start = function() {
    $scope.timerSet = $interval($scope.countDown, 1000);
  }

  $scope.stop = function() {
    $interval.cancel($scope.timerSet);
  }

  $scope.setWorkTime = function() {
    $scope.onBreak = false;
    $scope.toggleTime = APP_TIMERS.WORK_SESSION;
    $scope.toggleName = "Start";
  }

  $scope.setShortBreak = function() {
    $scope.onBreak = true;
    $scope.toggleTime = APP_TIMERS.SHORT_BREAK;
    $scope.toggleName = "Short Break";
  }

  // 30 minute break function.
  $scope.setLongBreak = function() {
    $scope.onBreak = true;
    Scope.toggleTime = APP_TIMERS.L;
    $scope.toggleName = "Long Break";
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