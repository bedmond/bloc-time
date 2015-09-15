blocTime = angular.module('BlocTime', ['ui.router', 'firebase']);

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

blocTime.controller('Home.controller', ['$scope', '$interval', 'APP_TIMERS', '$filter', '$firebaseArray', function($scope, $interval, APP_TIMERS, $filter, $firebaseArray) {

  $scope.title = "TIMER";
  $scope.toggleName = "START";
  $scope.toggleTime = APP_TIMERS.WORK_SESSION;
  $scope.onBreak = false;
  $scope.onLongBreak = false;
  $scope.onWorkTime = true;
  $scope.completedWorkSessions = 0;
  var soundFile = new buzz.sound("/sounds/Elevator Ding-SoundBible.com-685385892.mp3", {
    preload: true
  });

  $scope.countDown = function() {
    $scope.toggleTime -= 100; // speeded up countdown for testing.
    $scope.toggleName = "RESET";
    if ($scope.toggleTime == 0) {
      soundFile.play();
      console.log(soundFile);
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
    }
  };
 
   $scope.updateTimer = function() {
    if ($scope.toggleName === "RESET") {
      $scope.stop();
      if ($scope.onBreak) {
        $scope.setShortBreak();
      } if ($scope.onLongBreak) {
          $scope.setLongBreak();
      } if ($scope.onWorkTime) {
          $scope.setWorkTime(); 
      }
    } else {
      $scope.start();
      $scope.toggleName = "RESET";
    }
  };
  
  $scope.start = function() {
    $scope.timerSet = $interval($scope.countDown, 1000);
  }

  $scope.stop = function() {
    $interval.cancel($scope.timerSet);
  }

  $scope.setWorkTime = function() {
    $scope.onWorkTime = true;
    $scope.onBreak = false;
    $scope.onLongBreak = false;
    $scope.toggleTime = APP_TIMERS.WORK_SESSION;
    $scope.toggleName = "START";
  }

  $scope.setShortBreak = function() {
    $scope.onBreak = true;
    $scope.onLongBreak = false;
    $scope.onWorkTime = false;
    $scope.toggleTime = APP_TIMERS.SHORT_BREAK;
    $scope.toggleName = "5 MIN BREAK";
  }

  $scope.setLongBreak = function() {
    $scope.onLongBreak = true;
    $scope.onBreak = false;
    $scope.onWorkTime = false;
    $scope.toggleTime = APP_TIMERS.LONG_BREAK;
    $scope.toggleName = "30 MIN BREAK";
  }

  var ref = new Firebase("https://flickering-fire-4277.firebaseio.com");

  $scope.tasks = $firebaseArray(ref);

  $scope.addTask = function() {
    var name = $scope.task;
    $scope.tasks.$add({
      name: $scope.task,
      created_at: Firebase.ServerValue.TIMESTAMP
    });

    $scope.task = "";
  };

}]);

blocTime.filter('remainingTime', function() {
  return function(seconds) {
    seconds = Number.parseFloat(seconds);

    if (Number.isNaN(seconds)) {
      return '--:--';
    }

    var wholeSeconds = Math.floor(seconds);
    var minutes = Math.floor(wholeSeconds / 60);
    var remainingSeconds = wholeSeconds % 60;
    var output = minutes + ':';

    if (remainingSeconds < 10) {
      output += '0';
    }

    output += remainingSeconds;
    return output;
  }
});