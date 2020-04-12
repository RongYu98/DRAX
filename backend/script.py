from mongoengine import *
from classes import College, Account, HighSchool, StudentProfile, Application

connect('account', host='localhost', port=27017)
majors = []


def get_clean_majors():
    majors = []
    for c in College.objects:
        majors.extend(c.majors)
    majors = list(set(majors))
    cleaned_majors = []
    for m in majors:
        m = m.replace(', General', '')
        m = m.replace(', Other', '')
        if ('(' in m):
            m = m[:m.index('(')-1]+m[m.index(')')+1:]
        if ('and Related' in m):
            m = m[:m.index('and Related')-1].strip(',')
        cleaned_majors.append(m)
    cleaned_majors = list(set(cleaned_majors))
    cleaned_majors.sort()
    majors = []
    prev = cleaned_majors[0].strip()
    for m in cleaned_majors[1:]:
        if m.startswith(prev):  # purge or no purge?
            if (m.startswith(prev+" and ")):
                # then likely different, so we want this.
                majors.append(m)
                continue
            continue
        prev = m
        majors.append(m)
    return majors


def calc_academic_similarity(college, student):
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
            grades[status]['act_avg'].append(int(s.grades['act_composite']))
        if 'sat_ebrw' in s.grades and 'sat_math' in s.grades:
            grades[status]['sat_avg'].append(int(s.grades['sat_ebrw']))
        if 'sat_math' in s.grades:
            grades[status]['sat_avg'].append(int(s.grades['sat_math']))

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
            score = int(profile.grades['act_composite'])
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
                score += int(profile.grades['sat_math'])/2.0
                count += 1
            if 'sat_ebrw' in profile.grades:
                score += int(profile.grades['sat_ebrw'])/2.0
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
    accept_exam = [percent['Accepted']['sat'], percent['Accepted']['act']]
    not_accept_exam = [percent['Not Accepted']['gpa'], percent['Not Accepted']['act']]

    if accept_exam != [None, None]:
        if accept_exam[0] == None:
            accept_exam = accept_exam[1] * 2  # grow value remaining
        elif accept_exam[1] == None:
            accept_exam = accept_exam[0] * 2
        else:
            accept_exam = sum(accept_exam)
    else:
        accept_exam = None
    if not_accept_exam != [None, None]:
        if not_accept_exam[0] == None:
            not_accept_exam = not_accept_exam[1] * 2
        elif not_accept_exam[1] == None:
            not_accept_exam = not_accept_exam[0] * 2
        else:
            not_accept_exam = sum(not_accept_exam)
    else:
        not_accept_exam = None

    score = 0
    score_weight = 0
    if accept_exam is not None:
        score += 0.15 * accept_exam
        score_weight += 0.15
    if not_accept_exam is not None:
        score += 0.1 * accept_exam
        score_weight +=	0.1
    if percent['Accepted']['gpa'] is not None:
        score += 0.3 * percent['Accepted']['gpa']
        score_weight += 0.3
    if percent['Not Accepted']['gpa'] is not None:
        score += 0.2 * percent['Not Accepted']['gpa']
        score_weight += 0.2

    # score = 0.15 * (percent['Accepted']['sat'] +
    #                 percent['Accepted']['act'])
    # score += 0.10 * (percent['Not Accepted']['gpa'] +
    #                  percent['Not Accepted']['act'])
    # score += 0.3 * percent['Accepted']['gpa']
    # score += 0.2 * percent['Not Accepted']['gpa']
    if score_weight == 0:
        return -1  # -1 instead of None
    print(score / 1.0 / score_weight)
    return score / 1.0 / score_weight


print(calc_academic_similarity('Stony Brook University', 'alice'))
