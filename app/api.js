var User = require('../models/user');
var Review = require('../models/review');
var Comment = require('../models/comment');
var Professor = require('../models/professor');
var Course = require('../models/course');

module.exports = function(app, router, db) {
  db.on('error', console.error.bind(console, 'connection error'));
  db.once('open', console.log.bind(console, 'connected to db'));

  app.use('/api', router);
  function generateResponse(message, data) {
    data = (typeof data === 'undefined') ? [] : data;
    return {message: message, data: data};
  }

  // All our routes will start with /api
  app.use('/api', router);

  router
  .param('userId', function (req, res, next, userId) {
   req.userId = userId;
   next();
 })
  .param('reviewId', function (req, res, next, reviewId) {
   req.reviewId = reviewId;
   next();
 })
  .param('commentId', function (req, res, next, commentId) {
   req.commentId = commentId;
   next();
 })
  .param('courseId', function (req, res, next, courseId) {
   req.courseId = courseId;
   next();
 })
  .param('professorId', function (req, res, next, professorId) {
   req.professorId = professorId;
   next();
 });


  var options_array = ['sort', 'limit', 'skip', 'where', 'select'];
  //Users route here
  var usersRoute = router.route('/users');
  usersRoute
  .get(function(req, res) {
   var query = User.find();
   var keys = Object.keys(req.query);
   for (var i = 0, l = keys.length; i < l; i++) {
     if (options_array.indexOf(keys[i]) !== -1)
      query = query[keys[i]](JSON.parse(req.query[keys[i]]));
  };
  if (req.query.count == 'true') {
   query.count(function(err, count) {
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", count));
  });
 } else {
   query.exec(function(err, users) { 
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", users));
  });
 }
})
  .post(function(req, res) {
   var new_user = new User(req.body);
   User.findOne({ facebookId: new_user.facebookId }, function(err, auser) {
     if (!err && auser) {
      res.status(500).json(generateResponse("user already exists"));
    }
    else {
      new_user.save(function(err, new_user) {
        if (err) {
         var msg = '';
         Object.keys(err.errors).forEach(function(key) {
           msg += err.errors[key]['message'];
         });
         res.status(500).json(generateResponse(msg));
       }
       else
         res.status(201).json(generateResponse('User updated', new_user));
     });
    }
  });
 })
  .options(function(req, res) {
   res.writeHead(200);
   res.end();
 });

//User route here
var userRoute = router.route('/users/:userId');
userRoute
.get(function(req, res) {
	User.findById(req.userId, function(err, user) {
   if (err || !user)
    res.status(404).json(generateResponse('User not found'));
  else
    res.status(200).json(generateResponse('OK', user));
});
})
.put(function(req, res) {
 User.findById(req.userId, function(err, user) {
   if (err)
    res.status(404).json(generateResponse('User not found'));
  var paramsToChange = Object.keys(req.body);
  paramsToChange.forEach(function(param) {
    if (param != '_id')
      user[param] = req.body[param];
  });
  user.save(function(err, updatedUser) {
    if (err) {
      var msg = '';
      Object.keys(err.errors).forEach(function(key) {
       msg += err.errors[key]['message'];
     });
      res.status(500).json(generateResponse(msg));
    }
    else
      res.status(200).json(generateResponse('User updated', updatedUser));
  });
});
})
.delete(function(req, res) {
	User.findById(req.userId, function(err, user) {
   if (err || !user) {
    res.status(404).json(generateResponse('User not found'));
  }
  else {
    user.remove(function(err) {
      if (err)
       return res.status(500).json(generateResponse('Something goes wrong'));
     else
       return res.status(200).json(generateResponse('User deleted'));
   });
  }
});
});

var reviewsRoute = router.route('/reviews');
reviewsRoute
.get(function(req, res) {
	var query = Review.find();
	var keys = Object.keys(req.query);
	for (var i = 0, l = keys.length; i < l; i++) {
   if (options_array.indexOf(keys[i]) !== -1)
    query = query[keys[i]](JSON.parse(req.query[keys[i]]));
};

if (req.query.count == 'true') {
 query.count(function(err, count) {
  if (err)
    res.status(500).json(generateResponse('Something goes wrong'));
  else
    res.status(200).json(generateResponse("OK", count));
});
} else {
 query.exec(function(err, reviews) { 
  if (err)
    res.status(500).json(generateResponse('Something goes wrong'));
  else
    res.status(200).json(generateResponse("OK", reviews));
});
}
})
.post(function(req, res) {
	var new_review = new Review(req.body);
	new_review.save(function(err, new_review) {
   if (err) {
    console.log(err);
    var msg = '';
    Object.keys(err.errors).forEach(function(key) {
      msg += err.errors[key]['message'];
    });
    res.status(500).json(generateResponse(msg));
  }
  else
    res.status(201).json(generateResponse('Review created', new_review));
});
})
.options(function(req, res) {
	res.writeHead(200);
	res.end();
});

var bodyParser = require('body-parser');
var parseUrlencoded = bodyParser.urlencoded({extended: false}); //force the use of native queryString module in Node library

var reviewRoute = router.route('/reviews/:reviewId');
reviewRoute
.get(function(req, res) {
	Review.findById(req.reviewId, function(err, review) {
   if (err || !review)
    res.status(404).json(generateResponse('Review not found'));
  else
    res.status(200).json(generateResponse('OK', review));
});
})
.put(parseUrlencoded, function(req, res) {
  Review.findById(req.reviewId, function(err, review) {
    if (err)
      res.status(404).json(generateResponse('Review not found'));

//console.log('request.body ' + JSON.stringify(req.body));
    //console.log(req.body.comments);
    //console.log(req.body.comments[0]);
    var paramsToChange = Object.keys(req.body);
    paramsToChange.forEach(function(param) {
      if (param != '_id')
        review[param] = req.body[param];
    });
    review.save(function(err, updatedReview) {
      if (err) {
        console.log(err);
        var msg = '';
        Object.keys(err.errors).forEach(function(key) {
         msg += err.errors[key]['message'];
       });
        res.status(500).json(generateResponse(msg));
      }
      else
        res.status(200).json(generateResponse('Review updated', updatedReview));
    });
  });
})
.delete(function(req, res) {
	Review.findById(req.reviewId, function(err, review) {
   if (err || !review) {
    res.status(404).json(generateResponse('Review not found'));
  }
  else {
    review.remove(function(err) {
      if (err)
       return res.status(500).json(generateResponse('Something goes wrong'));
     else
       return res.status(200).json(generateResponse('Review deleted'));
   });
  }
});
});


  //Comments route 
  var commentsRoute = router.route('/comments');
  commentsRoute
  .get(function(req, res) {
   var query = Comment.find();
   var keys = Object.keys(req.query);
   for (var i = 0, l = keys.length; i < l; i++) {
     if (options_array.indexOf(keys[i]) !== -1)
      query = query[keys[i]](JSON.parse(req.query[keys[i]]));
  };

  if (req.query.count == 'true') {
   query.count(function(err, count) {
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", count));
  });
 } else {
   query.exec(function(err, comments) { 
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", comments));
  });
 }
})
  .post(function(req, res) {
   var new_comment = new Comment(req.body);
   new_comment.save(function (err, new_comment) {
     if (err) {
      var msg = '';
      console.log(err);
      Object.keys(err.errors).forEach(function(key) {
        msg += err.errors[key]['message'];
      });
      res.status(500).json(generateResponse(err.name + ': ' + msg));
    } else {
      res.status(201).json(generateResponse('Comment Created', new_comment));
    }
  });
 })
  .options(function(req, res) {
   res.writeHead(200);
   res.end();
 });

  //Comment route here
  var commentRoute = router.route('/comments/:commentId');
  commentRoute
  .get(function(req, res) {
   Comment.findById(req.commentId, function(err, comment) {
     if (err || !comment)
      res.status(404).json(generateResponse('Comment not found'));
    else
      res.status(200).json(generateResponse('OK', comment));
  });
 })
  .put(function(req, res) {
   Comment.findById(req.commentId, function(err, comment) {
     if (err)
      res.status(404).json(generateResponse('Comment not found'));
    var paramsToChange = Object.keys(req.body);
    paramsToChange.forEach(function(param) {
      if (param != '_id')
        comment[param] = req.body[param];
    });
    comment.save(function(err, updatedComment) {
      if (err) {
        var msg = '';
        Object.keys(err.errors).forEach(function(key) {
         msg += err.errors[key]['message'];
       });
        res.status(500).json(generateResponse(err.name + ': ' + msg));
      }
      else
        res.status(200).json(generateResponse('Comment updated', updatedComment));
    });
  });
 })
  .delete(function(req, res) {
   Comment.findById(req.commentId, function(err, comment) {
     if (err || !comment) {
      res.status(404).json(generateResponse('Comment not found'));
    }
    else {
      comment.remove(function(err) {
        if (err)
         return res.status(500).json('Something goes wrong');
       else
         return res.status(200).json(generateResponse('Comment deleted'));
     });
    }
  });
 });

  var professorsRoute = router.route('/professors');
  professorsRoute
  .get(function(req, res) {
   var query = Professor.find();
   var keys = Object.keys(req.query);
   for (var i = 0, l = keys.length; i < l; i++) {
     if (options_array.indexOf(keys[i]) !== -1)
      query = query[keys[i]](JSON.parse(req.query[keys[i]]));
  };
  if (req.query.count == 'true') {
   query.count(function(err, count) {
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", count));
  });
 } else {
   query.exec(function(err, professors) { 
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", professors));
  });
 }
})
  .post(function(req, res) {
   var new_professor = new Professor(req.body);
   new_professor.save(function (err, new_professor) {
     if (err) {
      var msg = '';
      console.log(err);
      Object.keys(err.errors).forEach(function(key) {
        msg += err.errors[key]['message'];
      });
      res.status(500).json(generateResponse(err.name + ': ' + msg));
    } else {
      res.status(201).json(generateResponse('Professor Created', new_professor));
    }
  });
 })
  .options(function(req, res) {
   res.writeHead(200);
   res.end();
 });
  
  //Professor route here
  var professorRoute = router.route('/professors/:professorId');
  professorRoute
  .get(function(req, res) {
   Professor.findById(req.professorId, function(err, professor) {
     if (err || !professor)
      res.status(404).json(generateResponse('Professor not found'));
    else
      res.status(200).json(generateResponse('OK', professor));
  });
 })
  .put(function(req, res) {
   Professor.findById(req.professorId, function(err, professor) {
     if (err)
      res.status(404).json(generateResponse('Professor not found'));
    var paramsToChange = Object.keys(req.body);
    paramsToChange.forEach(function(param) {
      if (param != '_id')
        professor[param] = req.body[param];
    });
    professor.save(function(err, updatedProfessor) {
      if (err) {
        var msg = '';
        Object.keys(err.errors).forEach(function(key) {
         msg += err.errors[key]['message'];
       });
        res.status(500).json(generateResponse(err.name + ': ' + msg));
      }
      else
        res.status(200).json(generateResponse('Professor updated', updatedProfessor));
    });
  });
 })
  .delete(function(req, res) {
   Professor.findById(req.professorId, function(err, professor) {
     if (err || !professor) {
      res.status(404).json(generateResponse('Professor not found'));
    }
    else {
      professor.remove(function(err) {
        if (err)
         return res.status(500).json('Something goes wrong');
       else
         return res.status(200).json(generateResponse('Professor deleted'));
     });
    }
  });
 });


  var coursesRoute = router.route('/courses');
  coursesRoute
  .get(function(req, res) {
   var query = Course.find();
   var keys = Object.keys(req.query);
   for (var i = 0, l = keys.length; i < l; i++) {
     if (options_array.indexOf(keys[i]) !== -1)
      query = query[keys[i]](JSON.parse(req.query[keys[i]]));
  };
  if (req.query.count == 'true') {
   query.count(function(err, count) {
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", count));
  });
 } else {
   query.exec(function(err, courses) { 
    if (err)
      res.status(500).json(generateResponse('Something goes wrong'));
    else
      res.status(200).json(generateResponse("OK", courses));
  });
 }
})
  .post(function(req, res) {
   var new_course = new Course(req.body);
   new_course.save(function (err, new_course) {
     if (err) {
      var msg = '';
      console.log(err);
      Object.keys(err.errors).forEach(function(key) {
        msg += err.errors[key]['message'];
      });
      res.status(500).json(generateResponse(err.name + ': ' + msg));
    } else {
      res.status(201).json(generateResponse('Course Created', new_course));
    }
  });
 })
  .options(function(req, res) {
   res.writeHead(200);
   res.end();
 });

  //Course route here
  var courseRoute = router.route('/courses/:courseId');
  courseRoute
  .get(function(req, res) {
   Course.findById(req.courseId, function(err, course) {
     if (err || !course)
      res.status(404).json(generateResponse('Course not found'));
    else
      res.status(200).json(generateResponse('OK', course));
  });
 })
  .put(function(req, res) {
   Course.findById(req.courseId, function(err, course) {
     if (err)
      res.status(404).json(generateResponse('Course not found'));
    var paramsToChange = Object.keys(req.body);
    paramsToChange.forEach(function(param) {
      if (param != '_id')
        course[param] = req.body[param];
    });
    course.save(function(err, updatedCourse) {
      if (err) {
        var msg = '';
        Object.keys(err.errors).forEach(function(key) {
         msg += err.errors[key]['message'];
       });
        res.status(500).json(generateResponse(err.name + ': ' + msg));
      }
      else
        res.status(200).json(generateResponse('Course updated', updatedCourse));
    });
  });
 })
  .delete(function(req, res) {
   Course.findById(req.courseId, function(err, course) {
     if (err || !course) {
      res.status(404).json(generateResponse('Course not found'));
    }
    else {
      course.remove(function(err) {
        if (err)
         return res.status(500).json('Something goes wrong');
       else
         return res.status(200).json(generateResponse('Course deleted'));
     });
    }
  });
 });
};