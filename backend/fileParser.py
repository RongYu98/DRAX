import csv
import hash_utils
from classes import Account, Application, College

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


def institution_type(arg):
    switcher = {
        "1": "Public",
        "2": "Private Nonprofit",
        "3": "Private For-Profit",
    }
    return switcher.get(arg, None)

def get_region(region, state):
    northeast = ["NJ", "NY", "PA"]
    south = ["DE", "DC", "MD", "OK", "TX"]
    west = ["AZ", "NM"]
    if region == "1" or state in northeast:
        return "Northeast"
    if region == "3" or region == "4":
        return "Midwest"
    if region == "5" or state in south:
        return "South"
    if region == "7" or region == "8" or state in west:
        return "West"
    if region == "9":
        return "Other"

def import_college_scorecard(scorecard, colleges):
    f = open(colleges, "r")
    college_list = []
    for c in f:
        college_list.append(c.rstrip())
    f.close()
    with open(scorecard) as sc:
        sc_reader = csv.reader(sc)
        for line in sc_reader:
            name = line[3]
            if name in college_list:
                print(name)
                city = line[4]
                state = line[5]
                region = get_region(line[18], state)
                institution = institution_type(line[16])
                admission_rate = line[36]
                size = line[290]
                median_debt = line[1504]
                if admission_rate != "NULL":
                    college = College(
                        name=name, city=city, state=state, region=region, institution=institution,
                        admission_rate=admission_rate, size=size, median_debt=median_debt,
                    )
                else:
                    college = College(
                        name=name, city=city, state=state, region=region, institution=institution,
                        size=size, median_debt=median_debt,
                    )
                try:
                    college.save()
                except:
                    print("Error importing college: " + name)