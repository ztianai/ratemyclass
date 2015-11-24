

angular.module('rateMyClass', ['ui.router','firebase'])


.config(function($stateProvider, $urlRouterProvider) {

  // // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/");


  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/home.html"
    })
    .state('search', {
      url: "/search",
      templateUrl: "partials/search.html"
    })
    .state('about', {
      url: "/about",
      templateUrl: "partials/about.html"
    })
    .state('contact', {
      url: "/contact",
      templateUrl: "partials/contact.html"
    })
    .state('addClass', {
      url: "/addClass",
      templateUrl: "partials/addclass.html"
    })

})

.controller('homeCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}]);


