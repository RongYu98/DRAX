import csv
import hash_utils
from classes import Account, Application

def importStudentData(filename):
    lines = []
    with open(filename) as f:
        reader = csv.reader(f)
        for line in reader:
            lines.append(line)

    header = lines[0]
    for line in lines[1:]:
        username = line[0]
        password = line[1]
        salt = hash_utils.generate_salt()
        digest = hash_utils.hmac_hash(password, salt)
        account = Account(username=username,
                          hashedPassword=digest,
                          salt=salt)
        try:
            account.save()
        except:
            print("There was an error importing student data: "+username)

        # Import the student's other data, like SAT scores

            
def deleteStudentData():
    Account.objects().delete() # should delete all account fields, including admin?
    Application.objects().delete() 
