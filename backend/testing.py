from algorithms import compare_highschool
from classes import HighSchool, StudentProfile, Account, College, Application

from mongoengine import *
connect('account', host='localhost', port=27017)


def test_compare_highschool(name1, name2):
    account1 = Account.objects.get(username='jcool')
    account2 = Account.objects.get(username='chuck')
    profile1 = StudentProfile(student=account1)
    profile2 = StudentProfile.objects.get(student=account2)
    profile2.high_school_city = "New York"
    profile2.high_school_name = "Stuyvesant High School"
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


def calc_academic_similarity(college, student, applications):
    c = College.objects.get(name=college)
    acc = Account.objects.get(username=student)
    profile = StudentProfile.objects.get(student=acc)

    applications = Application.objects(college=c)
    grades = {
        'Accepted': {
            'gpa_avg': [],
            'sat_avg': [],
            'act_avg': []
        }, 'Not Accepted': {
            'gpa_avg': [],
            'sat_avg': [],
            'act_avg': []
        }
    }

    for s in applications:
        status = s.status if s.status == 'Accepted' else 'Not Accepted'
        s = s.student
        if 'gpa' in s:
            grades[status]['gpa_avg'].append(s.gpa)
        if 'grades' not in s:
            continue
        if 'act_composite' in s.grades:
            grades[status]['act_avg'].append(s.grades['act_composite'])
        if 'sat_ebrw' in s.grades and 'sat_math' in s.grades:
            grades[status]['sat_avg'].append(s.grades['sat_ebrw'])
        if 'sat_math' in s.grades:
            grades[status]['sat_avg'].append(s.grades['sat_math'])

    percent = {
        'Accepted': {
            'gpa': None, 'sat': None, 'act': None
        }, 'Not Accepted': {
            'gpa': None, 'sat': None, 'act': None
        }
    }

    for status in grades:
        if 'gpa' in profile:
            g = grades[status]['gpa_avg']
            g.append(profile.gpa)
            g.sort(reverse=True)
            # not going to count the number of same grades, just the location
            # NOTE: reverse sort goes from high to low, 100th to 0th
            percent[status]['gpa'] = g.index(profile.gpa) / 1.0 / len(g) * 100
            percent[status]['gpa'] = 100 - percent[status]['gpa']
            print(profile.gpa)
            print(g)
            print(percent[status]['gpa'])

        if 'act_composite' in profile.grades:
            g = grades[status]['act_avg']
            score = profile.grades['act_composite']
            g.append(score)
            g.sort(reverse=True)
            percent[status]['act'] = 100 - g.index(score) / 1.0 / len(g) * 100

            print()
            print(profile.grades['act_composite'])
            print(g)
            print(percent[status]['act'])

        if 'sat_math' in profile.grades or 'sat_ebrw' in profile.grades:
            g = grades['Accepted']['sat_avg']
            score = 0
            count = 0
            if 'sat_math' in profile.grades:
                score += profile.grades['sat_math']/2.0
                count += 1
            if 'sat_ebrw' in profile.grades:
                score += profile.grades['sat_ebrw']/2.0
                count += 1
            if count == 1:
                score = score * 2
            g.append(score)
            g.sort(reverse=True)
            percent[status]['sat'] = 100 - g.index(score) / 1.0 / len(g) * 100
            print()
            print(score)
            print(g)
            print(percent[status]['sat'])

    print()
    print(percent)
    score = 0.15 * (percent['Accepted']['sat'] +
                    percent['Accepted']['act'])
    score += 0.10 * (percent['Not Accepted']['gpa'] +
                     percent['Not Accepted']['act'])
    score += 0.3 * percent['Accepted']['gpa']
    score += 0.2 * percent['Not Accepted']['gpa']
    print(score)
    # return gpa_percentile, sat_percentile, act_percentile
# test_compare_highschool('Stuyvesant High School',
#                          'Ward Melville Senior High School')
print(calc_academic_similarity('Stony Brook University', 'Alice', None))
