

angular.module('rateMyClass', ['ui.router','firebase'])


.config(function($stateProvider, $urlRouterProvider) {

  // // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");


  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/home.html"
    })

})

.controller('homeCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}]);


