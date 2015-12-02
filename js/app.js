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

.controller('MASTERCTRL', ['$scope', '$uibModal', function($scope, $uibModal) {

  $scope.authInit = function() {
    $uibModal.open({
                animation: true,
                templateUrl: 'partials/auth.html',
                controller: 'authCtrl'
   });
  } 
}])

.controller('authCtrl', ['$scope', '$firebaseObject', '$firebaseAuth', function($scope, $firebaseObject, $firebaseAuth) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
    var users = new Firebase("https://ratemyclass.firebaseio.com/users");

  $scope.users = $firebaseObject(users);
  var Auth = $firebaseAuth(ref);

  $scope.userObj = {};

  $scope.signUp = function() {
    ref.createUser({
      email    : $scope.newUser.email,
      password : $scope.newUser.password
    }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
    }).then($scope.signIn)
    .then(function(authData) {

      var newUserInfo = {
        'handle':$scope.newUser.handle,
      };

      $scope.users[authData.uid] = newUserInfo;
      $scope.users.$save();
      $scope.userID = authData.uid;
    })    
    .catch(function(error){
      //error handling (called on the promise)
      console.log(error);
    })
  }

  $scope.signIn = function() {
  ref.authWithPassword({
    email    : $scope.newUser.email,
    password : $scope.newUser.password
  }, function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    }
 else {
      console.log("Authenticated successfully with payload:", authData);
      remember: "sessionOnly"
      $scope.blah = $scope.newUser.handle;
    }
  });



  }

}])

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
            star: $scope.rate,
            prof: $scope.prof,
      			text: $scope.newReview,
      			gpa: $scope.gpa,
      			workload: $scope.workload,
      			helpfulness: $scope.helpfulness,
      			easiness: $scope.easiness,
      			time:Firebase.ServerValue.TIMESTAMP
      		})
      		.then(function(){
      			$scope.newReview = '';
      		})
      	}
        $scope.gpas = ['2.0 and lower', '2.0-3.0','3.0-3.5','3.5 and higher'];
        $scope.gpa = '';
        $scope.workloads = ['1-Not Much Work', '2', '3', '4', '5-Super Heavy Work'];
        $scope.workload = '';
        $scope.helpfulnesses = ['1-Not Useful', '2', '3', '4', '5-Gain Really Helpful Skills'];
        $scope.helpfulness = '';
        $scope.easinesses = ['1-Very Hard', '2-Makes You Work For It', '3-Usual Workload', '4-Easy "A"', '5-Show Up & Pass'];
        $scope.easiness = '';
        // $(function() {
        //   $("#slider").slider({
        //     value: 0,
        //     min: 0,
        //     max: 5,
        //     step: 1,
        //     slide: function(event, ui){
        //       $("#amount").val(ui.value);
        //     }
        //   });
        //   $("#amount").val($("#slider").slider("value")); 
        // })
        $scope.rate = 0;
        $scope.max = 5;
        


  }])


  .controller('helpCtrl', ['$scope', function($scope) {
      var ref = new Firebase("https://ratemyclass.firebaseio.com/");
  }])

