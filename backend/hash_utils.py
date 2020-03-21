import hmac
import hashlib
import random

def generate_salt():
    letters = '1234567890!@#$%^&*()qwertyuiopasdfghjklzxcvbnmQWERUIOPASDFGHJKLZXCVBNM[]{}\|;:<>,./?'
    salt = ''
    for x in range(0, 256):
        salt += letters[random.randint(0, len(letters)-1)]
    return salt

def hmac_hash(password, key):
    h = hmac.new(key.encode('utf-8'), password.encode('utf-8'), hashlib.sha256)
    return h.hexdigest()
