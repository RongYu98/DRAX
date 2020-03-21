from flask import Flask, request, session, jsonify
from flask_cors import CORS

from mongoengine import *

from classes import Account

import hash_utils

connect('account', host='localhost', port=27017)

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
        account.save()
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




                 
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
    
