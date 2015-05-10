var mongoose = require('mongoose');
var Course = require('../models/course');
var Professor = require('../models/professor')
var courses = require('./courses.json');
var professors = require('./professors.json');

//mongoose.connect('mongodb://localhost/final')
mongoose.connect('mongodb://project:project@ds063870.mongolab.com:63870/mp3');

// create and count the course objects
var numCourses = 0;
var courseObjects = {};
for (var key in courses) {
  if (courses.hasOwnProperty(key)) {
    var value = courses[key];
    courseObjects[key] = new Course({ name: value.name, description: value.description });
    numCourses++;
  }
}

// create and count the professor objects
var numProfessors = 0;
var professorObjects = {};
for (var key in professors) {
  if (professors.hasOwnProperty(key)) {
    var value = professors[key];
    professorObjects[key] = new Professor({ name: value.name });
    numProfessors++;
  }
}

// add the professors for each course
for (var key in courses) {
  if (courses.hasOwnProperty(key)) {
    var courseProfessors = courses[key].professors;
    for (var i = 0; i < courseProfessors.length; i++) {
      courseObjects[key].professors.push(professorObjects[courseProfessors[i]]._id);
    }
  }
}

// add the courses for each professor
for (var key in professors) {
  if (professors.hasOwnProperty(key)) {
    var professorCourses = professors[key].courses;
    for (var i = 0; i < professorCourses.length; i++) {
      professorObjects[key].courses.push(courseObjects[professorCourses[i]]._id);
    }
  }
}

mongoose.connection.on('connected', function() {
  console.log('connected to database');

  // add courses to database
  Course.remove({}, function(err, count) {
    console.log('removed ' + count + ' existing courses from database')
    console.log('inserting ' + numCourses + ' courses...');
    for (var key in courseObjects) {
      if (courseObjects.hasOwnProperty(key)) {
        courseObjects[key].save(callback);
      }
    }
  });

  // add professors to database
  Professor.remove({}, function(err, count) {
    console.log('removed ' + count + ' existing professors from database')
    console.log('inserting ' + numProfessors + ' professors...');
    for (var key in professorObjects) {
      if (professorObjects.hasOwnProperty(key)) {
        professorObjects[key].save(callback);
      }
    }
  });
}); 

mongoose.connection.on('error', function(err) { 
  console.log('error: ' + error);
}); 

var saved = 0;
var total = numCourses + numProfessors;
function callback() {
  ++saved;
  if (saved === total) {
    console.log('all ' + total + ' items added');
    process.exit();
  }
}