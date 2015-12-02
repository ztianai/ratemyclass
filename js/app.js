'use strict';

angular.module('rateMyClass', ['ui.router','firebase', 'ngAnimate', 'ui.bootstrap'])


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
    .state('help', {
      url: "/help",
      templateUrl: "partials/help.html",
      controller:'helpCtrl'
    })
  $urlRouterProvider.otherwise("/");

})

.controller('homeCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
       var ref = new Firebase("https://ratemyclass.firebaseio.com/classList/");   //EVERYONE, WATCH URLS.  THIS POINTS TO THE CLASSES, VS WITHOUT HAVING CLASSLIST ON THE END, IT JUST POINTS TO OUR DATABASE!
     $scope.classList = $firebaseArray(ref);





    //THIS IS HOW YOU MAKE A NEW REVIEW/CLASS/WHATEVER
    // ref.push({title:"Informatics 360"});


}])

.controller('searchCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}])

.controller('aboutCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}])

.controller('contactCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}])

.controller('addclassCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}])

.controller('reviewCtrl', ['$scope', '$firebaseObject','$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {
    /* define reference to your firebase app */
    var ref = new Firebase("https://probech1.firebaseio.com/");

      	/* define reference to the "reviews" value in the app */
      	var reviewsRef = ref.child("reviews");

      	/* define reference to the "users" value in the app */
      	var usersRef = ref.child("valueName");

      	/* create a $firebaseArray for the chirps reference and add to scope */
      	$scope.reviews = $firebaseArray(reviewsRef);

      	/* create a $firebaseObject for the users reference and add to scope (as $scope.users) */
         	$scope.users = $firebaseObject(usersRef);

      	var Auth = $firebaseAuth(ref);

      	$scope.newUser = {};



      	/* Write an accessible (on scope) chirp() function to save a tweet */
      	$scope.review = function() {
      		$scope.reviews.$add({
      			text: $scope.newReview,
      			userId: -1,
      			likes: 0,
      			time:Firebase.ServerValue.TIMESTAMP
      		})
      		.then(function(){
      			$scope.newReview = '';
      		})
      	}
        $scope.gpas = ['3.5+', '3.0-3.5', '2.0-3.0', '2.0-'];
        $scope.gpa = '';
        $scope.workloads = ['1--Not Much Work', '2', '3', '4', '5--Super Heavy Work'];
        $scope.workload = '';
        $scope.helpfulnesses = ['1--Not Useful', '2', '3', '4', '5--Gain Really Helpful Skills'];
        $scope.helpfulness = '';
        $scope.easinesses = ['1--Hardest Thing Ever', '2--Makes You Work For It', '3--The Usual', '4--Easy A', '5--Show Up & Pass'];
        $scope.easiness = '';
        $(function() {
          $("#slider").slider({
            value: 0,
            min: 0,
            max: 5,
            step: 1,
            slide: function(event, ui){
              $("#amount").val(ui.value);
            }
          });
          $("#amount").val($("#slider").slider("value")); 
        })
        $scope.rate = 0;
        $scope.max = 5;
        


  }])


  .controller('helpCtrl', ['$scope', function($scope) {
      var ref = new Firebase("https://ratemyclass.firebaseio.com/");
  }])

  .factory('userAuthFactory', function() {
    var obj = {};

    obj.clicked = function() {
      console.log("clicked!");
    }

    return obj;
  })

