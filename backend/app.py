from flask import Flask, request, session, jsonify
from flask_cors import CORS

from mongoengine import *

from classes import Account
from classes import StudentProfile
from classes import Application
from classes import College
from classes import HighSchool

from scraper import update_highschool_data

import hash_utils
import algorithms

connect('account', host='localhost', port=27017)
connect('college', alias='college')

app = Flask(__name__)
app.secret_key = 'Draconian Rich Awesome Xenomorphs'
CORS(app, supports_credentials=True) # may wish to disable cross origin in the cloud server for security

@app.route('/api/signup', methods=['POST'])
def signup():
    info = request.json
    # check there is a username and password
    if info==None or 'username' not in info or 'password' not in info:
        return jsonify(status = 400, result = "Missing Fields")
    print(info)
    username = str(info['username'])
    password = str(info['password'])

    # make an account class with the hashed info
    salt = hash_utils.generate_salt()
    digest = hash_utils.hmac_hash(password, salt)
    account = Account(username=username, 
                      hashed_password=digest,
                      salt=salt, type="Student")
    
    # try to save the data
    # if the username is not unique, pymongo will tell us :D
    try:
        student = account.save()
        # Create a student profile
        profile = StudentProfile(student=student).save()
        session['username'] = username
        return jsonify(status = 200, result = "OK")
    except ValidationError as e:
        print(e)
        return jsonify(status = 400, result = "Validation Error " + e)
    except NotUniqueError as e:
        print(e)
        return jsonify(status = 400, result = "Username already taken.")


@app.route('/api/login', methods=['POST'])
def login():
    info = request.json

    # check there is a username and password
    if info==None or 'username' not in info or 'password' not in info:
        return jsonify(status = 400, result = "Invalid Login")
    username = str(info['username'])
    password = str(info['password'])

    # try to get the Account
    try:
        account = Account.objects.get(username=username)
        print(account)
    except DoesNotExist as e:
        return jsonify(status = 400, result = "Invalid Login")
    
    # check the password
    digest = hash_utils.hmac_hash(password, account.salt)
    if digest == account.hashed_password:
        session['username'] = username
        return jsonify(status = 200, result = "OK")
    else:
        return jsonify(status = 400, result = "Invalid Login")

@app.route('/api/logout', methods=['POST'])
def logout():
    if 'username' in session and session['username'] != None:
        session['username'] = None
        return jsonify(status=200, result="Logged Out")
    return jsonify(status=400, result="Not Logged In")

@app.route('/api/alive', methods=['POST'])
def alive():
    if 'username' not in session or session['username']==None:
        return jsonify(status=400, result="Not Logged In")
    return jsonify(status=200, result="OK")


@app.route('/api/get_profile', methods=['POST'])
def get_profile():
    # Check if logged in
    if 'username' not in session or session['username'] == None:
        return jsonify(status=400, result="Not Logged In")
    # Get student profile
    try:
        student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
        profile = {
            'residence_state': student.residence_state,
            'high_school_name': student.high_school_name,
            'high_school_city': student.high_school_city,
            'high_school_state': student.high_school_state,
            'gpa': student.gpa,
            'college_class': student.college_class,
            }
        grades = student.grades
        for field in grades:
            profile[field] = grades[field]
        return jsonify(status=200, result="OK", profile = profile)
    except:
        return jsonify(status=400, result="Get Profile Failed")

@app.route('/api/save_profile', methods=['POST'])
def save_profile():
    # Check if logged in
    if 'username' not in session or session['username'] == None:
        return jsonify(status=400, result="Not Logged In")
    # Get student account
    try:
        account = Account.objects.get(username=session['username'])
        # Get student profile
        student = StudentProfile.objects.get(student=account)
        info = request.json
        if info == None:
            info = request.form
        grades = {}
        name = None
        city = None
        state = None
        for field in info:
            if field == 'password':
                digest = hash_utils.hmac_hash(info["password"], account.salt)
                account.update(set__hashed_password=digest)
            elif field == 'residence_state':
                student.update(set__residence_state=info["residence_state"])
            elif field == 'high_school_name':
                name = info["high_school_name"]
            elif field == 'high_school_city':
                city = info["high_school_city"]
            elif field == 'high_school_state':
                state = info["high_school_state"]
            elif field == 'gpa':
                student.update(set__gpa=info["gpa"])
            else:
                grades[field] = info[field]
        student.update(set__grades=grades)
        if (name not in {None, ""} and
            city not in {None, ""} and
            state not in {None, ""} and
            update_highschool_data(name, city, state)):
            student.update(set__high_school_name=name)
            student.update(set__high_school_city=city)
            student.update(set__high_school_state=state)
        return jsonify(status = 200, result = "OK")
    except:
        return jsonify(status = 400, result = "Save Failed")


@app.route('/api/get_admission_decision', methods=['POST'])
def get_admission_decision():
    # Check if logged in
    if 'username' not in session or session['username'] == None:
        return jsonify(status=400, result="Not Logged In")
    # Get student profile
    try:
        student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
        applications = Application.objects(student = student)
        admission_decisions = []
        for application in applications:
            admission = {
                'college': result.college.name,
                'status': result.status,
                'is_verified': is_verified,
                }
            admission_decisions.append(admission)
        return jsonify(status=200, result="OK", admission_decisions = admission_decisions)
    except:
        return jsonify(status=400, result="Get Admission Decisions Failed")

@app.route('/api/submit_admission_decision', methods=['POST'])
def submit_admission_decision():
    # Check if logged in
    if 'username' not in session or session['username'] == None:
        return jsonify(status=400, result="Not Logged In")
    # Get student profile
    student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
    info = request.json
    if info == None:
        info = request.form
    if 'college_name' in info and 'status' in info:
        try:
            username = session['username']
            college_name = info['college_name']
            status = info['status']
            try:
                college = College.objects.get(name=college_name)
            except:
                return jsonify(status = 400, result = "College Not Found")
            try:
                application = Application.objects.get(Q(student=student) & Q(college=college))
                application.update(set__status=status)
                return jsonify(status = 200, result = "OK")
            except:
                ID = hash_utils.sha_hash(username+"+=+"+college_name)
                Application(ID=ID, student=student, college=college, status=status).save()
                return jsonify(status = 200, result = "OK")
        except:
            return jsonify(status = 400, result = "Submission Failed")
    return jsonify(status = 400, result = "Missing Fields")


@app.route('/api/track_applications_list', methods=['POST'])
def track_applications_list():
    # Check if logged in
    if 'username' not in session or session['username'] == None:
        return jsonify(status=400, result="Not Logged In")
    info = request.json
    if info == None:
        info = request.form
    if 'college_name' in info:
        college_name = info['college_name']
        try:
            college = College.objects.get(name=college_name)
            applications = Application.objects(college=college)
            profiles = []
            sum_gpa = 0
            count_gpa = 0
            sum_sat_ebrw = 0
            count_sat_ebrw = 0
            sum_sat_math = 0
            count_sat_math = 0
            sum_act = 0
            count_act = 0
            for application in applications:
                application_status = application.status
                if 'statuses' in info:
                    if application_status not in info['statuses']:
                        continue
                student = application.student
                if 'high_schools' in info:
                    if student.high_school_name not in info['high_schools']:
                        continue
                if 'college_class_min' in info:
                    if student.college_class < info['college_class_min']:
                        continue
                if 'college_class_max' in info:
                    if student.college_class > info['college_class_max']:
                        continue
                profile = {
                    'username': student.student.username,
                    'residence_state': student.residence_state,
                    'high_school_name': student.high_school_name,
                    'high_school_city': student.high_school_city,
                    'high_school_state': student.high_school_state,
                    'gpa': student.gpa,
                    'college_class': student.college_class,
                    'application_status': application_status,
                    }
                grades = student.grades
                for field in grades:
                    profile[field] = grades[field]
                profiles.append(profile)
                if student.gpa not in {None, ""}:
                    sum_gpa += student.gpa
                    count_gpa += 1
                if 'sat_ebrw' in grades and grades['sat_ebrw'] not in {None, ""}:
                    sum_sat_ebrw += grades['sat_ebrw']
                    count_sat_ebrw += 1
                if 'sat_math' in grades and grades['sat_math'] not in {None, ""}:
                    sum_sat_math += grades['sat_math']
                    count_sat_math += 1
                if 'act_composite' in grades and grades['act_composite'] not in {None, ""}:
                    sum_act += grades['act_composite']
                    count_act += 1
            summary = {
                'avg_gpa': None,
                'avg_sat_ebrw': None,
                'avg_sat_math': None,
                'avg_act': None,
                }
            avg_gpa = None
            if count_gpa:
                summary['avg_gpa'] = sum_gpa/count_gpa
            if count_sat_ebrw:
                summary['avg_sat_ebrw'] = sum_sat_ebrw/count_sat_ebrw
            if count_sat_math:
                summary['avg_sat_math'] = sum_sat_math/count_sat_math
            if count_act:
                summary['avg_act'] = sum_act/count_act
        return jsonify(status = 200, result = "OK", profiles = profiles, summary = summary)
        except:
            return jsonify(status = 400, result = "College Not Found")
    return jsonify(status = 400, result = "Missing Fields")


@app.route('/api/get_college_list', methods=['POST'])
def get_college_list():
    # Check if logged in
    if 'username' not in session or session['username'] == None:
        return jsonify(status=400, result="Not Logged In")
    info = request.json
    if info == None:
        info = request.form
    query = Q()
    
    # Check filters
    if 'name' in info:
        name = info["name"]
        if name not in {"", None}:
            query = query & Q(name__icontains=name)
    if 'admission_rate' in info: # min and max
        admission_rate_min = info["admission_rate"]["min"]
        if admission_rate_min not in {"", None}:
            query = query & Q(admission_rate__gte=admission_rate_min)
        admission_rate_max = info["admission_rate"]["max"]
        if admission_rate_min not in {"", None}:
            query = query & Q(admission_rate__lte=admission_rate_max)
    if 'location' in info: # region
        location = info["location"]
        if location not in {"", None}:
            query = query & Q(region=location)
    if 'size' in info: # small, medium, or large
        size = info["size"]
        if size not in {"", None}:
            query = query & Q(size=size)
    if 'major' in info: # left and right
        major_left = info["major"]["left"]
        majors = []
        if major_left not in {"", None}:
            majors.append(major_left)
        major_right = info["major"]["right"]
        if major_left not in {"", None}:
            majors.append(major_right)
        if majors != []:
            query = query & Q(majors__in=majors)
    if 'max_ranking' in info:
        max_ranking = info["max_ranking"]
        if max_ranking not in {"", None}:
            query = query & Q(ranking__lte=max_ranking)
    if 'max_tuition' in info:
        max_tuition = info["max_tuition"]
        if max_tuition not in {"", None}:
            query = query & Q(cost__lte=max_tuition)
    if 'sat_ebrw' in info: # min and max
        sat_ebrw_min = info["sat_ebrw"]["min"]
        if sat_ebrw_min not in {"", None}:
            query = query & Q(avg_sat_ebrw__gte=sat_ebrw_min)
        sat_ebrw_max = info["sat_ebrw"]["max"]
        if sat_ebrw_max not in {"", None}:
            query = query & Q(avg_sat_ebrw__lte=sat_ebrw_max)
    if 'sat_math' in info: # min and max
        sat_math_min = info["sat_math"]["min"]
        if sat_math_min not in {"", None}:
            query = query & Q(avg_sat_math__gte=sat_math_min)
        sat_math_max = info["sat_math"]["max"]
        if sat_math_max not in {"", None}:
            query = query & Q(avg_sat_math__lte=sat_math_max)
    if 'act' in info: # min and max
        act_min = info["act"]["min"]
        if act_min not in {"", None}:
            query = query & Q(avg_act_composite__lte=act_min)
        act_max = info["act"]["max"]
        if act_max not in {"", None}:
            query = query & Q(avg_act_composite__lte=act_max)
    if 'policy' in info: # strict or lax
        policy = info["policy"]#do stuff with this after clarification
    
    student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
    residence_state = student.residence_state
    
    # Check sorting method
    sort = ""
    if 'sort' in info: # name, admission, cost, ranking
        sort = info["sort"]
    if sort == "recommendation":
        query_result = College.objects(query)
        # Return college list with recommendation scores
        college_list = []
        for result in query_result:
            score = algorithms.compute_recommendation_score(result, student)
            #if score < 20: # Eliminate college if the recommendation score is below a certain threshold
            if residence_state == result.state:
                cost = result.in_cost
            else:
                cost = result.out_cost
            college = {
                'name': result.name,
                'state': result.state,
                'institution': result.institution,
                'admission_rate': result.admission_rate,
                'completion_rate': result.completion_rate,
                'tuition': cost,
                'debt': result.median_debt,
                'ranking': result.ranking,
                'size': result.size,
                'college_id': str(result.id),
                'recommendation': score
                }
            college_list.append(college)
        def get_recommendation(c):
            return c["recommendation"]
        college_list.sort(reverse=True, key=get_recommendation)
        return jsonify(status=200, result="OK", colleges = college_list)
    elif sort == "ranking":
        query_result = College.objects(query).order_by('ranking')
    elif sort == "admission":
        query_result = College.objects(query).order_by('-admission_rate')
    elif sort == "name":
        query_result = College.objects(query).order_by('name')
    else:
        query_result = College.objects(query)
    
    # Return college list
    college_list = []
    for result in query_result:
        if residence_state == result.state:
            cost = result.in_cost
        else:
            cost = result.out_cost
        college = {
            'name': result.name,
            'state': result.state,
            'institution': result.institution,
            'admission_rate': result.admission_rate,
            'completion_rate': result.completion_rate,
            'tuition': cost,
            'debt': result.median_debt,
            'ranking': result.ranking,
            'size': result.size,
            'college_id': str(result.id),
            }
        college_list.append(college)
    if sort == "cost":
        def get_tuition(c):
            cost = c["tuition"]
            if cost != None:
                return cost
            else:
                return 0
        college_list.sort(key=get_tuition)
    return jsonify(status=200, result="OK", colleges = college_list)

@app.route('/api/all_majors')
def get_majors():
    import script # we will hardcode the list, so this will change...
    d = script.get_clean_majors()
    data = jsonify(status=200, result="OK", majors=d)
    return data

@app.route('/api/get_all_highschools')
def get_highschool():
    highschools = []
    for h in HighSchool.objects:
        highschools.append(h.name)
    return jsonify(status=200, result="OK", highschools=highschools)
    
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
    
