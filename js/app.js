'use strict';

angular.module('rateMyClass', ['ui.router', 'firebase', 'ngAnimate', 'ui.bootstrap', 'ngSanitize', 'leaflet-directive'])

//Provides functionality for ui-router and different states. 
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
        .state('help', {
            url: "/help",
            templateUrl: "partials/help.html",
            controller: 'helpCtrl'
        })
        .state('review', {
            url: "/{school}/{name}/{id}",
            templateUrl: "partials/review.html",
            controller: 'reviewCtrl'
        })
    $urlRouterProvider.otherwise("/");

})

//This is the overall controller for our website.  It primarly handles authentication across 
//every page on the website 
.controller('MASTERCTRL', ['$http', '$scope', '$uibModal', function($http, $scope, $uibModal) {

    $scope.authInit = function() {
        $scope.uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/auth.html',
            controller: 'authCtrl',
            scope: $scope
        });
    }

    $scope.changeVerification = function(verified, id) {
        $scope.userVerified = verified;
        $scope.userID = id;
        return $scope.userVerified;
    };

    $scope.isVerified = function() {
        return $scope.userVerified;
    }

    $scope.getUserID = function() {
        return $scope.userID;
    }
}])

//This is the authentication controller.  It handles creating new user accounts, signing in existing users, as well as 
//resetting passwords.  
.controller('authCtrl', ['$scope', '$firebaseObject', '$firebaseAuth', '$location', '$uibModal', function($scope, $firebaseObject, $firebaseAuth, $location, $uibModal) {

    /* define reference to your firebase app */
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");

    /* define reference to the "users" value in the app */
    var users = ref.child('users');

    /* create a $firebaseObject for the users reference and add to scope (as $scope.users) */
    $scope.users = $firebaseObject(users);
    var Auth = $firebaseAuth(ref);

    $scope.userObj = {};

    $scope.signUp = function() {

        //pass in an object with the new 'email' and 'password'
        Auth.$createUser({
                'email': $scope.newUser.email,
                'password': $scope.newUser.password
            })
            .then($scope.signIn)
            .then(function(authData) {

                var newUserInfo = {
                    'handle': $scope.newUser.handle
                };

                console.log(authData);

                $scope.users[authData.uid] = newUserInfo;

                $scope.users.$save();

                $scope.userID = authData.uid;

                $scope.changeVerification(true, authData.uid);

            })
            .catch(function(error) {
                //error handling (called on the promise)
                $scope.changeVerification(false, null);
                $scope.errorMessage = error;
                console.log(error);
            })
    };

    $scope.changePassword = function() {
        $scope.uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/changePassword.html',
            controller: 'changePasswordCtrl',
            scope: $scope
        });
    }

    $scope.resetPassword = function() {
        $scope.uibModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'partials/resetPassword.html',
            controller: 'resetPasswordCtrl',
            scope: $scope
        });
    }

    //Make LogOut function available to views
    $scope.logOut = function() {
        Auth.$unauth(); //"unauthorize" to log out
        $scope.changeVerification(false, null);
        $location.path('/');
    };

    //Any time auth status updates, set the userId so we know
    Auth.$onAuth(function(authData) {
        if (authData) { //if we are authorized
            $scope.userId = authData.uid;
            $scope.changeVerification(true, authData.uid);
        } else {
            $scope.userId = undefined;
            $scope.changeVerification(false, null);
        }
    });

    //Test if already logged in (when page load)
    var authData = Auth.$getAuth(); //get if we're authorized
    if (authData) {
        $scope.userId = authData.uid;
        $scope.changeVerification(true, authData.uid);
    }

    //separate signIn function
    $scope.signIn = function() {
        var promise = Auth.$authWithPassword({
            'email': $scope.newUser.email,
            'password': $scope.newUser.password
        });
        $scope.uibModalInstance.dismiss();
        return promise; //return promise so we can *chain promises*
        //and call .then() on returned value
    }
}])

//This controller controls the modal that helps the user change his or her password. 
.controller('changePasswordCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");

    //default values
    $scope.showPasswordsDoNotMatch = false;


    $scope.checkPass = function() {

        var confirmNewPass = $scope.user.confirmNewPass;
        var newPass = $scope.user.newPass;
        //Compare the values in the password field
        if (newPass === confirmNewPass) {
            $scope.showPasswordsDoNotMatch = false;
        } else {
            $scope.showPasswordsDoNotMatch = true;
        }
    }

    $scope.changePass = function() {
        ref.changePassword({
            email: $scope.email,
            oldPassword: $scope.oldPass,
            newPassword: $scope.newPass
        }, function(error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_PASSWORD":
                        console.log("The specified user account password is incorrect.");
                        break;
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error changing password:", error);
                }
            } else {
                console.log("User password changed successfully!");
                $scope.uibModalInstance.dismiss();
            }
        });
    }
}])

//This controller controls the modal that helps the user reset his or her password.  
.controller('resetPasswordCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");

    $scope.resetPass = function() {
        ref.resetPassword({
            email: $scope.email
        }, function(error) {
            if (error) {
                switch (error.code) {
                    case "INVALID_USER":
                        console.log("The specified user account does not exist.");
                        break;
                    default:
                        console.log("Error resetting password:", error);
                }
            } else {
                console.log("Password reset email sent successfully!");
                $scope.uibModalInstance.dismiss();
            }
        });
    }
}])

//This is the controller that controls the home page.  It displays recently added classes. 
.controller('homeCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com/classes/"); 
    $scope.classList = $firebaseArray(ref);
}])

//This is the controller that controls the search page.  It pulls data from our firebase
//database and allows filtering. 
.controller('searchCtrl', ['$scope', '$firebaseArray', function($scope, $firebaseArray) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com/classes/");
    $scope.classList = $firebaseArray(ref);
}])

//This is the controller that controls the about page.  
.controller('aboutCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");
}])

//This is the controller that controls the Contact page.  It resets the form after
//the form has been "submitted"
.controller('contactCtrl', ['$scope', function($scope) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");

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

//This is the add class controller.  It allows you to add a class for other users to see and review. 
.controller('addclassCtrl', ['$http', '$scope', '$firebaseArray', '$location', function($http, $scope, $firebaseArray, $location) {
    $scope.selected = undefined;

    $scope.isSelected = function(font) {
        return $scope.selected === font;
    }
    $scope.setMaster = function(font) {
        $scope.selected = font;
    }

    $http.get("../src/font-awesome.json").then(function(response) {
        $scope.fonts = response.data;
    });



    $http.get("../src/collegeData.json").then(function(response) {
        $scope.colleges = response.data;
    });

    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");
    var classes = ref.child('classes');
    $scope.classList = $firebaseArray(classes);


    $scope.addClass = function() {
        var className = $scope.addClassForm.className;
        console.log($scope.addClassForm.desc);
        $scope.classList.$add({
            icon: "fa " + $scope.selected,
            name: className,
            institution: $scope.selectedSchool,
            timestamp: Firebase.ServerValue.TIMESTAMP,
            desc: $scope.addClassForm.desc
        }).then(function() {
            $scope.addClassForm.className = "";
            $location.path('/');
        })
    }
}])

//This is the review controller.  It is the controller for each individual class.  
//It displays reviews relevant to that class at a specific shcool, and allows users 
//to add reviews of that class.  
.controller('reviewCtrl', ['$scope', '$uibModal', '$firebaseObject', '$firebaseArray', '$firebaseAuth', '$stateParams', function($scope, $uibModal, $firebaseObject, $firebaseArray, $firebaseAuth, $stateParams) {

    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");
    var reviewRef = ref.child('reviews');
    var classRef = ref.child('classes');
    $scope.reviews = $firebaseArray(reviewRef);

    $scope.classes = $firebaseArray(classRef);


    $scope.reviewFilter = $stateParams.name && $stateParams.school;

    var id = $stateParams.id;
    console.log($stateParams);

    $scope.r = {};
    $scope.schoolCenter = {};

    $scope.classes.$loaded().then(function(reviews) {
        $scope.r = reviews.$getRecord(id);
        $scope.SchoolName = $stateParams.school;
        $scope.ClassName = $stateParams.name;
        $scope.Institution = $scope.r.institution;
        $scope.Descr = $scope.r.desc;


        $scope.userVerified = $scope.isVerified();
        $scope.ID = $scope.getUserID();

        $scope.editReview = function(review) {
            $scope.reviewEdit = review;
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/edit-review-modal.html',
                controller: 'editReviewModal',
                scope: $scope
            })
        }

        $scope.addReview = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/review-modal.html',
                controller: 'ReviewModalCtrl',
                scope: $scope
            })
        }

        $scope.makeMap($scope.Institution);

    })

    $scope.makeMap = function(Institution) {
        console.log(Institution);
        $scope.addReview = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/review-modal.html',
                controller: 'ReviewModalCtrl',
                scope: $scope
            })
        }

        $scope.max = 5;
        angular.extend($scope, {
            schoolCenter: {
                lat: Institution.LATITUDE,
                lng: Institution.LONGITUD,
                zoom: 10
            },
            markers: {
                osloMarker: {
                    lat: Institution.LATITUDE,
                    lng: Institution.LONGITUD,
                    focus: true,
                    draggable: false
                }
            }
        });
        $scope.$digest();
    }
}])

//This is the edit review modal controller.  It allows a user to edit their own review, modifying all of the available fields. 
//Note: a user can only edit the reviews they wrote. 
.controller('editReviewModal', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', '$stateParams', '$http', '$uibModalInstance', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, $stateParams, $http, $uibModalInstance) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com/reviews/");
    $scope.reviewsToEdit = $firebaseArray(ref);
    var key = $scope.reviewEdit.$id;

    $scope.reviewsToEdit.$loaded().then(function(reviewsToEdit) {
        $scope.review = reviewsToEdit.$getRecord(key);
    });

    console.log($scope.reviewEdit.prof);


    $scope.prof = $scope.reviewEdit.prof;
    $scope.RATE = $scope.reviewEdit.star;
    $scope.quarter = $scope.reviewEdit.quarter;
    $scope.helpfulness = $scope.reviewEdit.helpfulness;
    $scope.workload = $scope.reviewEdit.workload;
    $scope.gpa = $scope.reviewEdit.gpa;
    $scope.easiness = $scope.reviewEdit.easiness;
    $scope.newReview = $scope.reviewEdit.text;

    $scope.gpas = ['2.0 and lower', '2.0-3.0', '3.0-3.5', '3.5 and higher'];
    $scope.workloads = ['1-Not Much Work', '2-Little Work', '3-Ok Work', '4-Lot Of Work', '5-Super Heavy Work'];
    $scope.helpfulnesses = ['1-Not Useful', '2-Somewhat Useful', '3-Basic Skills', '4-Worth Learning', '5-Gain Really Helpful Skills'];
    $scope.easinesses = ['1-Show Up & Pass', '2-Easy "A"', '3-Usual Workload', '4-Makes You Work For It', '5-Very Hard'];
    $scope.rate = 0;
    $scope.max = 5;

    $scope.modifyReview = function() {

        console.log($scope.prof);

        $scope.review.school = $scope.reviewEdit.school;
        $scope.review.className = $scope.reviewEdit.className;
        $scope.review.star = $scope.RATE;
        $scope.review.prof = $scope.prof;
        $scope.review.text = $scope.newReview,
            $scope.review.gpa = $scope.gpa;
        $scope.review.workload = $scope.workload;
        $scope.review.helpfulness = $scope.helpfulness;
        $scope.review.easiness = $scope.easiness;
        $scope.review.time = Firebase.ServerValue.TIMESTAMP;
        $scope.review.quarter = $scope.quarter;
        $scope.review.user = $scope.ID;

        $scope.reviewsToEdit.$save($scope.review);
        $uibModalInstance.dismiss('closing');
    }
}])

//The controller for the Help view
.controller('helpCtrl', ['$scope', function($scope) {
}])

//This is the controller for adding a new review.  It accepts various 
//characteristics of the class and saves it to firebase.  
.controller('ReviewModalCtrl', ['$scope', '$firebaseObject', '$firebaseArray', '$firebaseAuth', '$stateParams', '$http', '$uibModalInstance', function($scope, $firebaseObject, $firebaseArray, $firebaseAuth, $stateParams, $http, $uibModalInstance) {
    var ref = new Firebase("https://ratemyclasstianai.firebaseio.com");
    var reviews = ref.child('reviews');
    $scope.reviews = $firebaseArray(reviews);

    $scope.gpas = ['2.0 and lower', '2.0-3.0', '3.0-3.5', '3.5 and higher'];
    $scope.gpa = '';
    $scope.workloads = ['1-Not Much Work', '2-Little Work', '3-Ok Work', '4-Lot Of Work', '5-Super Heavy Work'];
    $scope.workload = '';
    $scope.helpfulnesses = ['1-Not Useful', '2-Somewhat Useful', '3-Basic Skills', '4-Worth Learning', '5-Gain Really Helpful Skills'];
    $scope.helpfulness = '';
    $scope.easinesses = ['1-Show Up & Pass', '2-Easy "A"', '3-Usual Workload', '4-Makes You Work For It', '5-Very Hard'];
    $scope.easiness = '';
    $scope.rate = 0;
    $scope.max = 5;

    $scope.submitReview = function() {
        $scope.reviews.$add({
                school: $scope.SchoolName,
                className: $scope.ClassName,
                star: $scope.rate,
                prof: $scope.prof,
                text: $scope.newReview,
                gpa: $scope.gpa,
                workload: $scope.workload,
                helpfulness: $scope.helpfulness,
                easiness: $scope.easiness,
                time: Firebase.ServerValue.TIMESTAMP,
                quarter: $scope.quarter,
                user: $scope.ID
            })
            .then(function() {
                $scope.newReview = '';
            })
        $uibModalInstance.dismiss('closing');

    }
}])