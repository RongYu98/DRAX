import csv
import hash_utils
from classes import Account, Application, StudentProfile

from mongoengine import *
connect('account', host='localhost', port=27017)

def import_student_data(filename):
    lines = []
    with open(filename) as f:
        reader = csv.reader(f)
        for line in reader:
            lines.append(line)

    header = lines[0]

    index = ['username', 'password', 'state', 'high school', 'high school city',
             'high school state', 'gpa', 'college class', 'major 1',
             'major 2', 'sat math', 'sat ebrw', 'act english', 'act math',
             'act reading', 'act science', 'act composition', 'sat lit',
             'sat us', 'sat world', 'sat math 1', 'sat math 2', 'sat eco bio',
             'sat mol bui', 'sat chem', 'sat physics', 'ap passed']
    
    for line in lines[1:]:
        username = line[0]
        password = line[1]
        salt = hash_utils.generate_salt()
        digest = hash_utils.hmac_hash(password, salt)
        account = Account(username=username,
                          hashed_password=digest,
                          salt=salt, type="Student")
        try:
            account.save()
        except Exception as e:
            print(e)
            print("There was an error importing student data: "+username)
            try: # if this account can't be saved, then try to load it
                account = Account.objects.get(username=username)
            except:
                print("Account could not be loaded: "+username)
                continue
        # Make student profile class
        # TODO: Decide on what attributes are optional
        # TODO: Add checks for if this data is not pressent?

        # need to add something unique to this...
        p = StudentProfile(
            student = account,
            gpa = float(line[index.index('gpa')]),
            residence_state=line[index.index('state')],
            college_class=line[index.index('college class')])
        for x in range(index.index('major 1'), len(index)):
            info = index[x]
            data = line[x]
            if data!='': # the field isn't empty
                p.grades[info] = data
        p.save()        
        
def import_application_data(filename):
    lines = []
    with open(filename) as f:
        reader = csv.reader(f)
        for line in reader:
            lines.append(line)
    for line in lines[1:]:
        username = line[0]
        college = line[1]
        status = line[2]
        # find the student by username
        # find the college by name

        try:
            # TODO: Change this to student?
            account = Account.objects.get(username=username)
        except DoesNotExist as e:
            print("Student Doesn't Exist: "+username)
            continue
        try:
            university = College.objects.get(name=college)
        except:#  DoesNotExist as e:
            print("College Doesn't Exist: "+college)
            continue
        
        app = Application(student=account,
                          college=university,
                          status=status)
        try:
            app.save()
        except:
            print("There was a problem with this application")
            print(line[0]+" "+line[1])
            continue
    
def delete_student_data():
    Account.objects().delete() # should delete all account fields, including admin?
    print('s')

    # StudentProfile.objects().delete()
    print('w')
    # Application.objects().delete() 

delete_student_data()
# import_application_data()
print("don")
import_student_data("students-1.csv")
