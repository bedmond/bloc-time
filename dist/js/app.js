blocTime = angular.module('BlocTime', ['ui.router']);

blocTime.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('home', {
    url: '/',
    controller: 'Home.controller',
    templateUrl: '/templates/home.html'
  });
}]);

blocTime.constant('APP_TIMERS', {
    'WORK_SESSION': 15 * 60, //changed times for testing.
    'SHORT_BREAK': 5 * 60,
    'LONG_BREAK': 10 * 60
  });

blocTime.controller('Home.controller', ['$scope', '$interval', 'APP_TIMERS', '$filter', function($scope, $interval, APP_TIMERS, $filter) {

  $scope.title = "Bloc Time";
  $scope.toggleName = "Start";
  $scope.toggleTime = APP_TIMERS.WORK_SESSION;
  $scope.onBreak = false;
  $scope.onLongBreak = false;
  $scope.completedWorkSessions = 0;
  $scope.soundFile = new buzz.sound("/sounds/DING1.mp3", {
    preload: true
  });

  $scope.countDown = function() {
    $scope.toggleTime -= 100; // speeded up countdown for testing.
    $scope.toggleName = "Reset";
    if ($scope.toggleTime == 0) {
      $scope.playSoundFile();
      $scope.stop();
      if ($scope.onBreak || $scope.onLongBreak) {
        $scope.setWorkTime();
      } else {
        $scope.completedWorkSessions++;
        console.log($scope.completedWorkSessions); //to test work session increments.
        if ($scope.completedWorkSessions == 2) { //changed for testing.
          $scope.setLongBreak();
          $scope.completedWorkSessions = 0;
        } else {
          $scope.setShortBreak();
        }
      }
      //watches for APP_TIMERS to hit 0, call $scope.play function.
      //Need to finish this.
      //$scope.$watch('toggleTime', function(newVal, oldVal) {
        //console.log(newVal, oldVal);
        //if (newVal == 0);
          //$scope.soundFile.play();
      //});
    }
  };
 
  //need to fix updateTimer so that toggling Reset button
  //on Long Break resets to Long Break instead of Short Break.
  $scope.updateTimer = function() {
    if ($scope.toggleName === "Reset") {
      $scope.stop();
      if ($scope.onBreak) {
        $scope.setShortBreak();
      } if ($scope.onLongBreak) {
      $scope.setLongBreak();
      } else {
        $scope.setWorkTime(); 
      }
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

  $scope.setLongBreak = function() {
    $scope.onLongBreak = true;
    $scope.toggleTime = APP_TIMERS.LONG_BREAK;
    $scope.toggleName = "Long Break";
  }

  $scope.playSoundFile = function() {
    $scope.soundFile = new buzz.sound("/sounds/DING1.mp3", {
    preload: true
  });

  }

}]);

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