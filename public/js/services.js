// js/services/todos.js
var baseUrl = 'http://localhost:3000';
angular.module('appServices', [])
  .factory('UserService', function ($http) {
    return restFunctions($http, 'users');
  })
  .factory('CourseService', function ($http) {
    return restFunctions($http, 'courses');
  })
  .factory('ProfessorService', function ($http) {
    return restFunctions($http, 'professors');
  })
  .factory('ReviewService', function ($http) {
    return restFunctions($http, 'reviews');
  })
  .factory('CommentService', function ($http) {
    return restFunctions($http, 'comments');
  })
  .factory('AuthService', function ($http, $window) {
    return {
      getUser: function(callback) {
        $http.get(baseUrl + '/profile')
          .success(function(data) {
            console.log(data);

            if (data.error) {
              //redirect
              //$location.path('/login.html');

              $window.location.href = "http://" + $window.location.host + "/login.html";

            } else {
              callback(data.user);
            }
          });
      },
      logout: function() {
        $http.get(baseUrl + '/logout')
          .success(function(data) {
            $window.location.href = "http://" + $window.location.host + "/login.html";
          });
      }
    }
  })

;

function restFunctions($http, endPoint) {
  return {
    get: function (p) {
      return $http.get(baseUrl + '/api/' + endPoint, {params: p});
    },
    getById: function(id) {
      return $http.get(baseUrl + '/api/'+ endPoint +'/' + id);
    },
    post: function(obj) {
      console.log('POST');
      console.log(obj);
      return $http({
        method: 'POST',
        url: baseUrl + '/api/'+ endPoint +'/',
        data: $.param(obj),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
      //return $http.post(baseUrl + '/api/'+ endPoint +'/', obj);
    },
    updateByObj: function(obj) {
      console.log('PUT');
      console.log(obj);
      var t= $http({
        method: 'PUT',
        url: baseUrl + '/api/'+ endPoint +'/' + obj._id,
        /*
        data: $.param({
          comments:['123412341234123412341234'],
          upvotes:[],
          downvotes:['345634563456345634563456']
        }),
        */
        data: $.param(obj),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
      console.log(t);
      return t;
    },
    deleteById: function(id) {
      return $http.delete(baseUrl + '/api/'+ endPoint +'/' + id);
    }
  }
}
