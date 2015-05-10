var passportApp = angular.module('passportApp', []);

passportApp.controller('profileController', ['$scope', '$http', function($scope, $http) {
   $scope.profile = false;
   
   $http.get('/profile').success(function(data) {
		console.log(data);
		if(!data.error) {
			$scope.profile = true;
			$scope.user = data.user;
		}

   });

   $scope.query = '';

   $http.get('http://lightmark.net:4000/api/courses').success(function(data) {
    $scope.courses = data.data;
   });

   //$scope.courses = ['cs 498 - web dev', 'cs 125 - intro', 'cs 173 - discrete structures', 'cs 225 - data structures', 'cs 233 - computer architecture', 'cs 241 - systems programming'];
 }]);