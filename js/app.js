'use strict';

angular.module('rateMyClass', ['ui.router', 'firebase', 'ngAnimate', 'ui.bootstrap'])


.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: "partials/home.html",
            controller: 'homeCtrl'
        })
        .state('search', {
            url: "/search",
            templateUrl: "partials/search.html",
            controller: 'searchCtrl'
        })
        .state('about', {
            url: "/about",
            templateUrl: "partials/about.html",
            controller: 'aboutCtrl'
        })
        .state('contact', {
            url: "/contact",
            templateUrl: "partials/contact.html",
            controller: 'contactCtrl'
        })
        .state('addClass', {
            url: "/addClass",
            templateUrl: "partials/addclass.html",
            controller: 'addclassCtrl'
        })
        .state('review', {
            url: "/review",
            templateUrl: "partials/review.html",
            controller: 'reviewCtrl'
        })
        .state('help', {
            url: "/help",
            templateUrl: "partials/help.html",
            controller: 'helpCtrl'
        })
    $urlRouterProvider.otherwise("/");

})

.controller('MASTERCTRL', ['$scope', '$uibModal', function($scope, $uibModal) {

    $scope.authInit = function() {
        $uibModal.open({
            animation: true,
            templateUrl: 'partials/auth.html',
            controller: 'authCtrl',
            scope: $scope
        });
    }


}])

//////////
.controller('authCtrl', ['$scope', '$firebaseObject', '$firebaseAuth', function($scope, $firebaseObject, $firebaseAuth) {
    $scope.userVerified = true;

    /* define reference to your firebase app */
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");


    /* define reference to the "chirps" value in the app */
    // var chirps = ref.child('chirps');

    /* define reference to the "users" value in the app */
    var users = ref.child('users');

    /* create a $firebaseArray for the chirps reference and add to scope */
    // $scope.chirpsArray = $firebaseArray(chirps);

    /* create a $firebaseObject for the users reference and add to scope (as $scope.users) */
    $scope.users = $firebaseObject(users);
    var Auth = $firebaseAuth(ref);

    $scope.userObj = {};


    $scope.signUp = function() {
        console.log("creating user " + $scope.newUser.email);
        //pass in an object with the new 'email' and 'password'
        Auth.$createUser({
                'email': $scope.newUser.email,
                'password': $scope.newUser.password
            }).then($scope.signIn)
            .then(function(authData) {
                // if (userObj.avatar === undefined) {
                //     userObj.avatar = "img/no-pic.png"
                // }

                var newUserInfo = {
                    'handle': $scope.newUser.handle//,
                    // 'avatar': $scope.userObj.avatar
                };

                $scope.users[authData.uid] = newUserInfo;

                $scope.users.$save();

                $scope.userID = authData.uid;
            })
            .catch(function(error) {
                //error handling (called on the promise)
                console.log(error);
            })
    };

    //Make LogOut function available to views
    $scope.logOut = function() {
        Auth.$unauth(); //"unauthorize" to log out
    };

    //Any time auth status updates, set the userId so we know
    Auth.$onAuth(function(authData) {
        if (authData) { //if we are authorized
            $scope.userId = authData.uid;
        } else {
            $scope.userId = undefined;
        }
    });

    //Test if already logged in (when page load)
    var authData = Auth.$getAuth(); //get if we're authorized
    if (authData) {
        $scope.userId = authData.uid;
        $scope.userVerified = false;
    }

    //separate signIn function
    $scope.signIn = function() {
      console.log("signing in...");
        var promise = Auth.$authWithPassword({
            'email': $scope.newUser.email,
            'password': $scope.newUser.password
        });
        return promise; //return promise so we can *chain promises*
        //and call .then() on returned value
    };

    /* Write an accessible (on scope) chirp() function to save a tweet */
    // $scope.chirp = function() {
    //     var text = $scope.newChirp;
    //     $scope.chirpsArray.$add({
    //         text: text,
    //         userID: -1,
    //         likes: 0,
    //         time: Firebase.ServerValue.TIMESTAMP
    //     }).then(function() {
    //         $scope.newChirp = "";
    //     })
    // };

}])


//////////

.controller('homeCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/classList/"); //EVERYONE, WATCH URLS.  THIS POINTS TO THE CLASSES, VS WITHOUT HAVING CLASSLIST ON THE END, IT JUST POINTS TO OUR DATABASE!
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

    $scope.submitForm = function() {
        $scope.submitted = true;
    }

    $scope.resetForm = function() {
        $scope.submitted = false;
        $scope.contactForm.$setPristine();
        $scope.contactForm.$setUntouched();
        $scope.contactForm.$invalid = true;
    }
}])

.controller('addclassCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclass.firebaseio.com/");
}])

.controller('reviewCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {
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
                time: Firebase.ServerValue.TIMESTAMP
            })
            .then(function() {
                $scope.newReview = '';
            })
    }
    $scope.gpas = ['2.0 and lower', '2.0-3.0', '3.0-3.5', '3.5 and higher'];
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