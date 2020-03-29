from mongoengine import *
from classes import College

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
