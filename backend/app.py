from flask import Flask, request, session, jsonify
from mongoengine import *

from account import Account

import hashUtils

connect('account', host='localhost', port=27017)

# 11.27


app = Flask(__name__)
app.secret_key = 'Kats Trilling is AWESOME!'


@app.route('/signup', methods=['POST'])
def signup():
    info = request.json

    # check there is a username and password
    if info==None or 'username' not in info or 'password' not in info:
        return jsonify(status = 400, result = "Missing Fields")
    print(info)
    username = str(info['username'])
    password = str(info['password'])

    # make an account class with the hashed info
    salt = hashUtils.generateSalt()
    digest = hashUtils.hmacHash(password, salt)
    account = Account(username=username, 
                      hashedPassword=digest,
                      salt=salt)
    
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


@app.route('/login', methods=['POST'])
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
    digest = hashUtils.hmacHash(password, account.salt)
    if digest == account.hashedPassword:
        session['username'] = username
        return jsonify(status = 200, result = "OK")
    else:
        return jsonify(status = 400, result = "Invalid Login")


                          
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=9000, debug=True)
    
