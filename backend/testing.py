from algorithms import compare_highschool
from classes import HighSchool, StudentProfile, Account

from mongoengine import *
connect('account', host='localhost', port=27017)

def test_compare_highschool(name1, name2):
    account1 = Account.objects.get(username='jcool')
    account2 = Account.objects.get(username='chuck')
    profile1 = StudentProfile(student=account1)
    profile2 = StudentProfile.objects.get(student=account2)
    profile2.high_school_city = "New York"
    profile2.high_school_name="Stuyvesant High School"
    profile2.high_school_state = "NY"
    profile2.save()
    h1 = HighSchool.objects.get(name=name1)
    h2 = HighSchool.objects.get(name=name2)

    # d = compare_highschool(h1, h2, )

    s1 = StudentProfile.objects(high_school_name=h1.name,
                                high_school_city=h1.city,
                                high_school_state=h1.state)
    s2 = StudentProfile.objects(high_school_name=h2.name,
                                high_school_city=h2.city,
                                high_school_state=h2.state)
    d = compare_highschool(h1, h2, s1, s2)
    
    print(d)
    # originally: 168.77854938271605
    
    
test_compare_highschool('Stuyvesant High School', 'Ward Melville Senior High School')
    
