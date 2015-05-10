import json
import requests
from xml.etree import ElementTree

course_dict = dict()
professor_dict = dict()

def get_xml(url):
    response = requests.get(url)
    return ElementTree.fromstring(response.content)

def add_course(course_id, course_name, course_description):
    if course_id in course_dict:
        course = course_dict[course_id]
        if course['name'] != course_name:
            print 'warning: course name does not match for', course_id
        if course['description'] != course_description:
            print 'warning: course description does not match for', course_id
    else:
        course_dict[course_id] = {'name': course_name, 'description': course_description, 'professors': set()}

def hash_professor(first_name, last_name=None):
    if not last_name:
        last_name = first_name.split(' ')[-1]
    return first_name[0].lower() + last_name.lower()

def is_professor(first_name, last_name):
    key = hash_professor(first_name, last_name)
    return key in professor_dict

def add_professor(course_id, first_name, last_name):
    key = hash_professor(first_name, last_name)
    if key in professor_dict:
        course_dict[course_id]['professors'].add(key)
        professor_dict[key]['courses'].add(course_id)

# load professors from file
professor_names = json.load(open('professor_list.json'))
for professor_name in professor_names:
    key = hash_professor(professor_name)
    if key in professor_dict:
        print 'warning: duplicate key for professor names'
    professor_dict[key] = {'name': professor_name, 'courses': set()}

# scrape the courses
semester_urls = ['http://courses.illinois.edu/cisapi/schedule/2015/spring/CS',
                 'http://courses.illinois.edu/cisapi/schedule/2015/summer/CS',
                 'http://courses.illinois.edu/cisapi/schedule/2015/fall/CS',
                 'http://courses.illinois.edu/cisapi/schedule/2014/spring/CS',
                 'http://courses.illinois.edu/cisapi/schedule/2014/summer/CS',
                 'http://courses.illinois.edu/cisapi/schedule/2014/fall/CS']
for semester_url in semester_urls:
    semester_xml = get_xml(semester_url)

    # go through the courses for each semester
    courses = semester_xml.findall('./courses/course')
    for course in courses:
        course_url = course.get('href')
        course_xml = get_xml(course_url)

        # get the course information
        course_id = ' '.join(course_url.split('/')[-2:]).upper()
        course_title = course_xml.find('label').text
        course_name = course_id + ' - ' + course_title
        course_description = course_xml.find('description').text
        add_course(course_id, course_name, course_description)

        # go through the sections in the course
        sections = course_xml.findall('./sections/section')
        has_professor = False
        for section in sections:
            section_xml = get_xml(section.get('href'))

            # go through the instructors for each section
            instructors = get_xml(section.get('href')).findall('./meetings/meeting/instructors/instructor')
            for instructor in instructors:
                first_name = instructor.get('firstName')
                last_name = instructor.get('lastName')
                has_professor |= is_professor(first_name, last_name)
                add_professor(course_id, first_name, last_name)

        print 'parsed', course_name
    print 'parsed', '/'.join(semester_url.split('/')[-3:])

# check for courses without professors
print
print 'checking for courses without professors'
for value in course_dict.itervalues():
    if len(value['professors']) == 0:
        print 'warning: course', value['name'], 'has no professors'

# change sets to lists
for value in course_dict.itervalues():
    value['professors'] = list(value['professors'])
for value in professor_dict.itervalues():
    value['courses'] = list(value['courses'])

# write courses and professors
json.dump(course_dict, open('courses.json', 'w'))
json.dump(professor_dict, open('professors.json', 'w'))
