from flask import Flask, request, session, jsonify
from flask_cors import CORS

from mongoengine import *

from classes import Account
from classes import StudentProfile
from classes import Application
from classes import College
from classes import HighSchool

from scraper import highschool_exists

import hash_utils
import algorithms
import file_parser
import scraper

connect('account', host='localhost', port=27017)
connect('college', alias='college')

app = Flask(__name__)
app.secret_key = 'Draconian Rich Awesome Xenomorphs'
CORS(app, supports_credentials=True)
# may wish to disable cross origin in the cloud server for security


@app.route('/api/signup', methods=['POST'])
def signup():
    info = request.json
    # check there is a username and password
    if info is None or 'username' not in info or 'password' not in info:
        return jsonify(status=400, result="Missing Fields")
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
        return jsonify(status=200, result="OK")
    except ValidationError as e:
        print(e)
        return jsonify(status=400, result="Validation Error " + e)
    except NotUniqueError as e:
        print(e)
        return jsonify(status=400, resuls="Username already taken.")


@app.route('/api/login', methods=['POST'])
def login():
    info = request.json

    # check there is a username and password
    if info is None or 'username' not in info or 'password' not in info:
        return jsonify(status=400, result="Invalid Login")
    username = str(info['username'])
    password = str(info['password'])

    # try to get the Account
    try:
        account = Account.objects.get(username=username)
        print(account)
    except DoesNotExist as e:
        return jsonify(status=400, result="Invalid Login")

    # check the password
    digest = hash_utils.hmac_hash(password, account.salt)
    if digest == account.hashed_password:
        session['username'] = username
        return jsonify(status=200, result="OK")
    else:
        return jsonify(status=400, result="Invalid Login")


@app.route('/api/logout', methods=['POST'])
def logout():
    if 'username' in session and session['username'] is not None:
        session['username'] = None
        return jsonify(status=200, result="Logged Out")
    return jsonify(status=400, result="Not Logged In")


@app.route('/api/alive', methods=['POST'])
def alive():
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    return jsonify(status=200, result="OK")


@app.route('/api/get_profile', methods=['POST'])
def get_profile():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
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
        return jsonify(status=200, result="OK", profile=profile)
    except:
        return jsonify(status=400, result="Get Profile Failed")


@app.route('/api/save_profile', methods=['POST'])
def save_profile():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    # Get student account
    try:
        account = Account.objects.get(username=session['username'])
        # Get student profile
        student = StudentProfile.objects.get(student=account)
    except:
        return jsonify(status=400, result="Save Failed")
    info = request.json
    if info is None:
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
        highschool_exists(name, city, state)):
        student.update(set__high_school_name=name)
        student.update(set__high_school_city=city)
        student.update(set__high_school_state=state)
    return jsonify(status=200, result="OK")


@app.route('/api/get_admission_decision', methods=['POST'])
def get_admission_decision():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    # Get student profile
    try:
        student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
        applications = Application.objects(student=student)
        admission_decisions = []
        for application in applications:
            admission = {
                'college': application.college.name,
                'status': application.status,
                'verification': application.verification,
                }
            admission_decisions.append(admission)
        return jsonify(status=200, result="OK", admission_decisions=admission_decisions)
    except:
        return jsonify(status=400, result="Get Admission Decisions Failed")


@app.route('/api/submit_admission_decision', methods=['POST'])
def submit_admission_decision():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    # Get student profile
    student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
    info = request.json
    if info is None:
        info = request.form
    if 'college_name' in info and 'status' in info:
        try:
            username = session['username']
            college_name = info['college_name']
            status = info['status']
            try:
                college = College.objects.get(name=college_name)
            except:
                return jsonify(status=400, result="College Not Found")
            try:
                application = Application.objects.get(Q(student=student) & Q(college=college))
                verification = "Approved"
                if status == "Accepted" and detect_questionable_acceptance(college, student) < 50:
                    verification = "Pending"
                application.update(set__status=status)
                application.update(set__verification=verification)
                return jsonify(status=200, result="OK", verification=verification)
            except:
                ID = hash_utils.sha_hash(username+"+=+"+college_name)
                verification = "Approved"
                if status == "Accepted" and detect_questionable_acceptance(college, student) < 50:
                    verification = "Pending"
                Application(ID=ID, student=student, college=college, status=status, verification=verification).save()
                return jsonify(status=200, result="OK", verification=verification)
        except:
            return jsonify(status=400, result="Submission Failed")
    return jsonify(status=400, result="Missing Fields")


@app.route('/api/track_applications_list', methods=['POST'])
def track_applications_list():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    info = request.json
    if info is None:
        info = request.form
    if 'college_name' in info:
        college_name = info['college_name']
        college = None
        try:
            college = College.objects.get(name=college_name)
        except:
            return jsonify(status=400, result="College Not Found")
        if 'policy' in info:  # strict or lax
            policy = info["policy"]
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
            if 'statuses' in info and info['statuses'] is not None:
                if policy == "lax" and application_status is None:
                    pass
                elif info['statuses'] != [] and application_status.lower() not in info['statuses']:
                    continue
            student = application.student
            profile = application.student
            grades = student.grades
            for x in profile:
                print(x)
                print(profile[x])
            if 'high_schools' in info and info['high_schools'] is not None:
                if policy == "lax" and student.high_school_name is None:
                    pass
                elif info['high_schools'] != [] and student.high_school_name not in info['high_schools']:
                    continue
            if (('college_class_min' in info or 'college_class_max' in info) and
                (info['college_class_max'] is not None or
                 info['college_class_min'] is not None)):
                college_year = None
                try:
                    college_year = grades['college_class']
                except:
                    pass
                if policy == "strict" and college_year is None:
                    continue
                if ('college_class_min' in info and
                    info['college_class_min'] is not None and
                    college_year is not None):
                    if grades['college_class'] < info['college_class_min']:
                        continue
                if ('college_class_max' in info and
                    info['college_class_max'] is not None and
                    college_year is not None):
                    if grades['college_class'] > info['college_class_max']:
                        continue
            profile = {
                'username': student.student.username,
                'residence_state': student.residence_state,
                'high_school_name': student.high_school_name,
                'high_school_city': student.high_school_city,
                'high_school_state': student.high_school_state,
                'gpa': student.gpa,
                'college_class': grades['college_class'] if 'college_class' in grades else None,
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
        if profiles == []:
            return jsonify(status=200, result="OK", profiles=profiles)
        if count_gpa:
            summary['avg_gpa'] = round(sum_gpa/count_gpa, 2)
        if count_sat_ebrw:
            summary['avg_sat_ebrw'] = round(sum_sat_ebrw/count_sat_ebrw, 2)
        if count_sat_math:
            summary['avg_sat_math'] = round(sum_sat_math/count_sat_math, 2)
        if count_act:
            summary['avg_act'] = round(sum_act/count_act, 2)

        def get_status(p):
            return p['application_status']

        profiles.sort(key=get_status)
        return jsonify(status=200, result="OK", profiles=profiles, summary=summary)
    return jsonify(status=400, result="Missing Fields")


@app.route('/api/track_applications_plot', methods=['POST'])
def track_applications_plot():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    info = request.json
    if info is None:
        info = request.form
    if 'college_name' in info and 'test_type' in info:
        college_name = info['college_name']
        college = None
        try:
            college = College.objects.get(name=college_name)
        except:
            return jsonify(status=400, result="College Not Found")
        if 'policy' in info:  # strict or lax
            policy = info["policy"]
        applications = Application.objects(college=college)
        test_type = info['test_type']
        coordinates = []
        for application in applications:
            application_status = application.status
            if 'statuses' in info and info['statuses'] is not None:
                if policy == "lax" and application_status is None:
                    pass
                elif info['statuses'] != [] and application_status.lower() not in info['statuses']:
                    continue
            student = application.student
            grades = student.grades
            college_year = None
            try:
                college_year = grades['college_class']
            except:
                pass
            if 'high_schools' in info and info['high_schools'] is not None:
                if policy == "lax" and student.high_school_name is None:
                    pass
                elif info['high_schools'] != [] and student.high_school_name not in info['high_schools']:
                    continue
            if policy == "strict" and college_year is None:
                continue
            if ('college_class_min' in info and
                info['college_class_min'] is not None and
                college_year is not None):
                if student.college_class is None or student.college_class < info['college_class_min']:
                    continue
            if ('college_class_max' in info and
                info['college_class_max'] is not None and
                college_year is not None):
                if (student.college_class is None or
                    student.college_class > info['college_class_max']):
                    continue
            test_score = None
            if test_type == "SAT":
                if ('sat_math' in grades and grades['sat_math'] not in {None, ""} and
                    'sat_ebrw' in grades and grades['sat_ebrw'] not in {None, ""}):
                    test_score = int(grades['sat_math']) + int(grades['sat_ebrw'])
            if test_type == "ACT":
                if 'act_composite' in grades and grades['act_composite'] not in {None, ""}:
                    test_score = grades['act_composite']
            if test_type == "SAT_ACT":
                test_count = 0
                total = 0
                if ('sat_math' in grades and grades['sat_math'] not in {None, ""} and
                    'sat_ebrw' in grades and grades['sat_ebrw'] not in {None, ""}):
                    test_count += 1
                    total += (int(grades['sat_math'])+int(grades['sat_ebrw']))
                if ('act_composite' in grades and
                    grades['act_composite'] not in {None, ""}):
                    test_count += 1
                    adjusted = 400 + round((grades['act_composite']-1)*(240/7), -1)
                    total += adjusted
                if not test_count:
                    continue
                remainder = total/test_count
                weighted_subjects = 0
                remaining_weight = 1.0
                for field in grades:
                    if ('sat_' in field and
                        field not in {'sat_math', 'sat_ebrw'}):
                        if grades[field] not in {None, ""}:
                            weighted_subjects += grades[field]*0.1
                            remaining_weight -= 0.05
                test_score = weighted_subjects + remainder*remaining_weight
            if test_score is None:
                continue
            coordinate = {
                'x': test_score,
                'y': student.gpa,
                'status': application_status
                }
            coordinates.append(coordinate)
        return jsonify(status=200, result="OK", coordinates=coordinates)
    return jsonify(status=400, result="Missing Fields")


@app.route('/api/get_college_list', methods=['POST'])
def get_college_list():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    info = request.json
    if info is None:
        info = request.form
    student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
    residence_state = student.residence_state
    query = Q()

    # Check filters
    if 'name' in info:
        name = info["name"]
        if name not in {"", None}:
            query = query & Q(name__icontains=name)
    if 'policy' in info:  # strict or lax
        policy = info["policy"]
    if 'admission_rate' in info:  # min and max
        admission_rate_min = info["admission_rate"]["min"]
        if admission_rate_min not in {"", None}:
            adm_rte_min_query = Q(admission_rate__gte=admission_rate_min)
            if policy == "lax":
                lax = (adm_rte_min_query | Q(admission_rate=None))
                query = query & lax
            else:
                query = query & adm_rte_min_query
        admission_rate_max = info["admission_rate"]["max"]
        if admission_rate_max not in {"", None}:
            adm_rte_max_query = Q(admission_rate__lte=admission_rate_max)
            if policy == "lax":
                lax = (adm_rte_max_query | Q(admission_rate=None))
                query = query & lax
            else:
                query = query & adm_rte_max_query
    if 'location' in info:  # region
        location = info["location"]
        if location not in {"", None}:
            location_query = Q(region=location)
            if policy == "lax":
                lax = (location_query | Q(region=None))
                query = query & lax
            else:
                query = query & location_query
    if 'size' in info:  # small, medium, or large
        size = info["size"]
        if size not in {"", None}:
            if size == "small":
                size_query = Q(size__lt=2000)
            elif size == "medium":
                size_query = Q(size__lte=15000)
            else:
                size_query = Q(size__gt=15000)
            if policy == "lax":
                lax = (size_query | Q(size=None))
                query = query & lax
            else:
                query = query & size_query
    if 'major' in info:  # left and right
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
            ranking_query = Q(ranking__lte=max_ranking)
            if policy == "lax":
                lax = (ranking_query | Q(ranking=None))
                query = query & lax
            else:
                query = query & ranking_query
    if 'max_tuition' in info:
        max_tuition = info["max_tuition"]
        if max_tuition not in {"", None}:
            out_state = Q(out_cost__lte=max_tuition)
            if policy == "lax":
                out_state = (out_state | Q(out_cost=None))
            in_state = Q(in_cost__lte=max_tuition) & Q(state=residence_state)
            if policy == "lax":
                in_state = (in_state | Q(in_cost=None))
            cost_q = (out_state | in_state)
            query = query & cost_q
    if 'sat_ebrw' in info:  # min and max
        sat_ebrw_min = info["sat_ebrw"]["min"]
        if sat_ebrw_min not in {"", None}:
            ebrw_min_query = Q(avg_sat_ebrw__gte=sat_ebrw_min)
            if policy == "lax":
                lax = (ebrw_min_query | Q(avg_sat_ebrw=None))
                query = query & lax
            else:
                query = query & ebrw_min_query
        sat_ebrw_max = info["sat_ebrw"]["max"]
        if sat_ebrw_max not in {"", None}:
            ebrw_max_query = Q(avg_sat_ebrw__lte=sat_ebrw_max)
            if policy == "lax":
                lax = (ebrw_max_query | Q(avg_sat_ebrw__ne=None))
                query = query & lax
            else:
                query = query & ebrw_max_query
    if 'sat_math' in info:  # min and max
        sat_math_min = info["sat_math"]["min"]
        if sat_math_min not in {"", None}:
            math_min_query = Q(avg_sat_math__gte=sat_math_min)
            if policy == "lax":
                lax = (math_min_query | Q(avg_sat_math__ne=None))
                query = query & lax
            else:
                query = query & math_min_query
        sat_math_max = info["sat_math"]["max"]
        if sat_math_max not in {"", None}:
            math_max_query = Q(avg_sat_math__lte=sat_math_max)
            if policy == "lax":
                lax = (math_max_query | Q(avg_sat_math__ne=None))
                query = query & lax
            else:
                query = query & math_max_query
    if 'act' in info:  # min and max
        act_min = info["act"]["min"]
        if act_min not in {"", None}:
            act_min_query = Q(avg_act_composite__gte=act_min)
            if policy == "lax":
                lax = (act_min_query | Q(avg_act_composite__ne=None))
                query = query & lax
            else:
                query = query & act_min_query
        act_max = info["act"]["max"]
        if act_max not in {"", None}:
            act_max_query = Q(avg_act_composite__lte=act_max)
            if policy == "lax":
                lax = (act_max_query | Q(avg_act_composite__ne=None))
                query = query & lax
            else:
                query = query & act_max_query

    # Check sorting method
    sort = ""
    if 'sort' in info:  # name, admission, cost, ranking
        sort = info["sort"]
    if sort == "recommendation":
        query_result = College.objects(query)
        # Return college list with recommendation scores
        college_list = []
        for result in query_result:
            score = algorithms.compute_recommendation_score(result, student)
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
        return jsonify(status=200, result="OK", colleges=college_list)
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
            if cost is not None:
                return cost
            else:
                return 0

        college_list.sort(key=get_tuition)
    return jsonify(status=200, result="OK", colleges=college_list)


@app.route('/api/get_similar_profiles', methods=['POST'])
def get_similar_profiles():
    # Check if logged in
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    info = request.json
    if info is None:
        info = request.form
    if 'college_name' in info:
        college_name = info['college_name']
        college = None
        try:
            college = College.objects.get(name=college_name)
        except:
            return jsonify(status=400, result="College Not Found")
        student = StudentProfile.objects.get(student=Account.objects.get(
            username=session['username']))
        grades = student.grades
        applications = Application.objects(Q(college=college) &
                                           Q(student__ne=student))
        students = []
        for application in applications:
            students.append(application.student)

        def get_score(s):
            s_grades = s.grades
            score = 0
            if student.gpa not in {None, ''} and s.gpa not in {None, ''}:
                diff = abs(student.gpa-s.gpa)
                score += (100-diff*75) * .3
            if 'sat_math' in grades and 'sat_math' in s_grades:
                diff = abs(grades['sat_math']-s_grades['sat_math'])
                score += (100-diff/2) * .15
            if 'sat_ebrw' in grades and 'sat_ebrw' in s_grades:
                diff = abs(grades['sat_ebrw']-s_grades['sat_ebrw'])
                score += (100-diff/2) * .15
            if 'act_composite' in grades and 'act_composite' in grades:
                diff = abs(grades['act_composite']-s_grades['act_composite'])
                score += (100-diff*(60/7)) * .30
            return score

        students.sort(reverse=True, key=get_score)
        students = students[0:10]
        profiles = []
        for student in students:
            profile = {
                'username': student.student.username,
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
            profiles.append(profile)
        return jsonify(status=200, result="OK", profiles=profiles)
    return jsonify(status=400, result="Missing Fields")


@app.route('/api/find_similar_highschools')
def find_similar_highschools():
    # OUTPUT: This API should return the list of similar high schools with their info.
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Not Logged In")
    student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
    if (student.high_school_name is None or
        student.high_school_city is None or
        student.high_school_state is None):
        return jsonify(status=400, result="Profile High School Data Not Present!")
    try:
        hs = HighSchool.objects.get(name=student.high_school_name,
                                    city=student.high_school_city,
                                    state=student.high_school_state)
    except Exception as e:
        print(e)
        # this should not happen, because app confirms data being present
        # first before assigning values. But just in case.
        return jsonify(status=400, result="High School Data Not Present")

    hs_students = StudentProfile.objects(high_school_name=student.high_school_name,
                                         high_school_city=student.high_school_city,
                                         high_school_state=student.high_school_state)
    sorting = []  # a list of lists, each containing a score and HS
    for h in HighSchool.objects:
        # if h == hs:  # do we mind sending the high school as well?
        #     continue
        h_students = StudentProfile.objects(high_school_name=h.name,
                                            high_school_city=h.city,
                                            high_school_state=h.state)
        score = algorithms.compare_highschool(hs, h, hs_students, h_students)
        sorting.append([score, h])
    sorting.sort(key=lambda x: x[0])  # by the first element
    response = []
    print("SCORES")
    for s in sorting[:]:  # to what length?
        print(s[0])  # the score
        data = {'name': s[1].name,  # 'city': s[1].city,
                'location': s[1].city+', '+s[1].state,  # 'state': s[1].state,
                'reading_prof': s[1].reading_prof,
                'math_prof': s[1].math_prof, 'grad_rate': s[1].grad_rate,
                'avg_sat': s[1].avg_sat, 'avg_act': s[1].avg_act,
                'ap_enroll': s[1].ap_enroll, 'dissimilarity': s[0]}
        response.append(data)
        # response.append(s[1].name)
    return jsonify(status=200, data=response)


@app.route('/api/all_majors')
def get_majors():
    import script  # we may hardcode the list, so this will change...
    d = script.get_clean_majors()
    data = jsonify(status=200, result="OK", majors=d)
    return data


@app.route('/api/get_all_highschools')
def get_highschool():
    highschools = []
    for h in HighSchool.objects:
        highschools.append(h.name)
    return jsonify(status=200, result="OK", highschools=highschools)


@app.route('/api/update_rankings')
def update_rankings():
    # if 'username' not in session or session['username'] != "admin":
    #    return jsonify(status=400, result="Invalid User")
    scraper.update_college_ranking()
    return jsonify(status=200, result="OK")


@app.route('/api/import_college_scorecard')
def import_scorecard():
    file_parser.import_college_scorecard("Most-Recent-Cohorts-All-Data-Elements.csv")
    return jsonify(status=200, result="OK")


@app.route('/api/update_all_college_data')
def update_all_college_data():
    # if 'username' not in session or session['username'] != "admin":
    #    return jsonify(status=400, result="Invalid User")
    # file_parser.import_college_scorecard("Most-Recent-Cohorts"\
    #     "-All-Data-Elements.csv")
    scraper.update_all_colleges()
    return jsonify(status=200, result="OK")


@app.route('/api/import_student_profile_applications')
def import_student_profile_applications():
    file_parser.import_student_data("students-1.csv")
    file_parser.import_application_data('applications-1.csv')
    return jsonify(status=200, result="OK")


@app.route('/api/delete_all_students')
def delete_all_students():
    if 'username' not in session or session['username'] != "admin":
        return jsonify(status=400, result="Invalid User")
    scraper.delete_student_data()
    return jsonify(status=200, result="OK")


@app.route('/api/get_questionable_decisions')
def get_questionable_decisions():
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Invalid User")
    apps = Application.objects(verification='Pending')
    # apps = Application.objects(status='Pending')
    data = []
    for app in apps:
        profile = app.student
        s_data = {"name":profile.student.username}
        s_data.update(profile.grades)
        coll = app.college
        c_data = dict(coll.to_mongo())
        del c_data['_id']
        del c_data['majors']
        # print(c_data)
        d = {'student':s_data, 'college':c_data}
        data.append(d)
    return jsonify(status=200, result=data)


@app.route('/api/decide_admission_decision', methods=['POST'])
def decide_admission_decision():
    if 'username' not in session or session['username'] is None:
        return jsonify(status=400, result="Invalid User")
    info = request.json
    if info is None:
        info = request.form
    if 'student_name' not in info:
        return jsonify(status=400, result="Missing Student Name")
    if 'college_name' not in info:
        return jsonify(status=400, result="Missing College Name")
    if 'status' not in info:
        return jsonify(status=400, result="Missing Response")
    if info['status'] != 'Approved' and info['status'] != 'Denied':
        return jsonify(status=400, result="Unknown Response")
    prof = StudentProfile.objects.get(student=Account.objects.get(username=info['student_name']))
    coll = College.objects.get(name=info['college_name'])
    try:
        appl = Application.objects.get(student=prof, college=coll)
    except Exception as e:
        print(e)
        return jsonify(status=400, result="Application Does Not Exist")
    if appl.verification != 'Pending':
        return jsonify(status=400, result="Application already decided")
    appl.update(set__verification=info['status'])
    return jsonify(status=200, result="OK")

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
