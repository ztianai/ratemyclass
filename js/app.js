

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
    .state('help', {
      url: "/help",
      templateUrl: "partials/help.html",
      controller:'helpCtrl'
    })
  $urlRouterProvider.otherwise("/");

})

.controller('homeCtrl', ['$scope', 'userAuthFactory', function($scope, $userAuthFactory) {
       var ref = new Firebase("https://ratemyclass.firebaseio.com/classList");   //EVERYONE, WATCH URLS.  THIS POINTS TO THE CLASSES, VS WITHOUT HAVING CLASSLIST ON THE END, IT JUST POINTS TO OUR DATABASE!


//    $scope.clicked = function() {
//      $userAuthFactory.clicked();
//    }


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

.controller('reviewCtrl', ['$scope', '$firebaseObject','$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {
    /* define reference to your firebase app */
    var ref = new Firebase("https://probech1.firebaseio.com/");
    console.log("home controller!");

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
  }])


  .controller('helpCtrl', ['$scope', function($scope) {
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

