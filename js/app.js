

angular.module('rateMyClass', ['ui.router','firebase'])


.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/home.html",
      controller:'homeCtrl'
    })
    .state('search', {
      url: "/search",
      templateUrl: "partials/search.html",
      controller:'searchCtrl'
    })
    .state('about', {
      url: "/about",
      templateUrl: "partials/about.html",
      controller:'aboutCtrl'
    })
    .state('contact', {
      url: "/contact",
      templateUrl: "partials/contact.html",
      controller:'contactCtrl'
    })
    .state('addClass', {
      url: "/addClass",
      templateUrl: "partials/addclass.html",
      controller:'addclassCtrl'
    })
    .state('review', {
      url: "/review",
      templateUrl: "partials/review.html",
      controller:'reviewCtrl'
    })
  $urlRouterProvider.otherwise("/");

})

.controller('homeCtrl', ['$scope', 'userAuthFactory', function($scope, $userAuthFactory) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/classList");   //EVERYONE, WATCH URLS.  THIS POINTS TO THE CLASSES, VS WITHOUT HAVING CLASSLIST ON THE END, IT JUST POINTS TO OUR DATABASE!
    console.log("home controller!");

    $scope.clicked = function() {
      $userAuthFactory.clicked();
    }

    //THIS IS HOW YOU MAKE A NEW REVIEW/CLASS/WHATEVER
    // ref.push({class:"blah", "review":5});


}])

.controller('searchCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
    console.log("home controller!");
}])

.controller('aboutCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
    console.log("home controller!");
}])

.controller('contactCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
    console.log("home controller!");
}])

.controller('addclassCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
    console.log("home controller!");
}])

.controller('reviewCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
    console.log("home controller!");
}])


.factory('userAuthFactory', function() {
  var obj = {};

  obj.clicked = function() {
    console.log("clicked!");
  }

  return obj;
})