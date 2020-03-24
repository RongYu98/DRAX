from flask import Flask, request, session, jsonify
from flask_cors import CORS

from mongoengine import *

from classes import Account
from classes import StudentProfile
from classes import College

import hash_utils
import algorithms

connect('account', host='localhost', port=27017)
connect('college', alias='college')

app = Flask(__name__)
app.secret_key = 'Kats Trilling is AWESOME!'
CORS(app, supports_credentials=True) # may wish to disable cross origin in the cloud server for security

@app.route('/api/signup', methods=['POST'])
def signup():
    info = request.json
    print(request.form.get('username'))
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
        #profile = StudentProfile(student=student).save()
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
    # Check sorting method
    sort = ""
    if 'sort' in info: # name, admission, cost, ranking
        sort = info["sort"]
    if sort == "recommendation":
        student = StudentProfile.objects.get(student=Account.objects.get(username=session['username']))
        query_result = College.objects(query)
        college_list = []
        for result in query_result:
            score = algorithms.compute_recommendation_score(result, student)
            college = {
                'name': result.name,
                'state': result.state,
                'institution': result.institution,
                'admission_rate': result.admission_rate,
                'completion_rate': result.completion_rate,
                'tuition': result.in_cost,
                'debt': result.median_debt,
                'ranking': result.ranking,
                'size': result.size,
                'college_id': str(result.id),
                'recommendation': score
                }
            college_list.append(college) #need to sort results by score
        return jsonify(status=200, result="OK", colleges = college_list)
    elif sort == "ranking":
        query_result = College.objects(query).order_by('ranking')
    elif sort == "cost":
        query_result = College.objects(query).order_by('in_cost') #need to use in/out of state cost depending on residence
    elif sort == "admission":
        query_result = College.objects(query).order_by('-admission_rate')
    else:
        query_result = College.objects(query).order_by('name')
    college_list = []
    for result in query_result:
        college = {
            'name': result.name,
            'state': result.state,
            'institution': result.institution,
            'admission_rate': result.admission_rate,
            'completion_rate': result.completion_rate,
            'tuition': result.in_cost,
            'debt': result.median_debt,
            'ranking': result.ranking,
            'size': result.size,
            'college_id': str(result.id),
            }
        college_list.append(college)
    return jsonify(status=200, result="OK", colleges = college_list)

                 
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
    
