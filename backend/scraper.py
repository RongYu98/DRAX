import urllib.request # for connecting and getting html content
from bs4 import BeautifulSoup # for parsing html
import fileParser as file_parser # we'll chane the names later...

from mongoengine import *
connect('account', host='localhost', port=27017)
from classes import College

# Scraping Algorithm:
# 1. Get the HTML text, make it pretty.
# 2. Locate the important section.
# 3. Parse the important section for info.

# Function to get the soupified html content of url
def get_pretty_html(url):
    # header from a webscraping tutorial, to fool server
    hdr = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
           'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
           'Accept-Charset': 'ISO-8859-1,utf-8;q=0.7,*;q=0.3',
           'Accept-Language': 'en-US,en;q=0.8'}

    # actually get the site's content
    req = urllib.request.Request(url, headers=hdr)
    html = urllib.request.urlopen(req)

    # make the content pretty
    soup = BeautifulSoup(html, 'html.parser')
    return soup
    
def get_college_ranking():
    WSJ_THE_URL = "http://allv22.all.cs.stonybrook.edu/~stoller/cse416/WSJ_THE/index.html"

    # get the parsed html
    soup = get_pretty_html(WSJ_THE_URL)

    # find <div class="toggle-cols">, that is the start of the data
    d = soup.find("div", {"class":"toggle-cols"})

    # <div class="spacer"></div><div id="datatable-1_wrapper" class="dataTables_wrapper form-inline dt-bootstrap no-footer"><table id="datatable-1" class="table wur-hash-processed wur-cols-processed wur-pagelen-processed dataTable no-footer rank-only stats usr-processed"
    d = soup.find("div", {"id":"datatable-1_wrapper"})

    # <table aria-describedby="datatable-1_info" class="table wur-hash-processed wur-cols-processed wur-pagelen-processed dataTable no-footer rank-only stats usr-processed" data-module="rankings_table" id="datatable-1"
    d = soup.find("table", {"id":"datatable-1"})

    d = soup.find('table').find_all('tr')

    data = []
    for td in d:
        row = []
        for tr in td.strings:
            row.append(tr)
        data.append(row)
    # print(data[0:10])

    cleanedData = []
    for line in data:
        line[0] = line[0].strip(' ><=') # ranking, remove the =7, >600, etc
        cleanedData.append(line)

    rank_to_names = {}
    name_to_rank = {} 
    for line in cleanedData[1:]: # ignore the header
        rank = line[0]
        name = line[1]
        if rank not in rank_to_names:
            rank_to_names[rank] = []
        rank_to_names[rank].append(name)
        name_to_rank[name] = rank
    
    return {'rank to name':rank_to_names, 'name_to_rank':name_to_rank}
def update_college_ranking():
    data = get_college_ranking()['name_to_rank']
    colleges = file_parser.get_collegetxt_list()
    for name in colleges:
        if name in data:
            try:
                c = College.objects.get(name=name)
                c.ranking = int(data[name])
            except Exception as e:
                print(e)
                try: # college not in db, so make a class for it
                    c = College(name=name, ranking=int(data[name]))
                    c.save()
                except:
                    print("Error updating rank for college: "+name)
                    continue
            

def get_college_data_data(name):
    name = name.replace(' ', '-') # stony brook becomes stony-brook
    url = 'http://allv22.all.cs.stonybrook.edu/~stoller/cse416/collegedata/'
    url = url + name

    majors = []
    fresh_grades = []
    pop_stats = []
    cost = []
    
    soup = get_pretty_html(url)

    # undergrad majors:
    # <h3 class="h5">Undergraduate Majors</h3>
    data = soup.find("h3", string="Undergraduate Majors")
    data = data.next_sibling.next_sibling # list of majors is 2 siblings down
    majors = [major.strip() for major in data.strings if major.strip()!='']

    # Qualifications of Enrolled Freshmen
    # <h3 class="h5">Qualifications of Enrolled Freshmen</h3>
    data = soup.find("h3", string="Qualifications of Enrolled Freshmen")
    data = data.next_sibling.next_sibling
    grades = [grade.strip() for grade in data.strings if grade.strip()!='']
    fresh_grades = grades
    avg_gpa_index = fresh_grades.index('Average GPA')+1
    # the below are supposed to be average index, may not exist...
    sat_math_index = fresh_grades.index('SAT Math')+1
    sat_ebrw_index = fresh_grades.index('SAT EBRW')+1
    act_comp_index = fresh_grades.index('ACT Composite')+1
    avg_gpa = float(fresh_grades[avg_gpa_index])

    # in case there are no values at the site
    avg_sat_math, sat_math_25th, sat_math_75th = None, None, None
    if ('average' in fresh_grades[sat_math_index]):
        # then we know there's a provided average, use it
        avg_sat_math = int(fresh_grades[sat_math_index].split()[0])
        sat_math_index += 1 # move the pointer along, to the next info
    if ('range of middle 50%' in fresh_grades[sat_math_index]):
        # '590-680 range of middle 50%'
        d = fresh_grades[sat_math_index].split()[0].split('-') 
        sat_math_25th = int(d[0])
        sat_math_75th = int(d[1])

    avg_sat_ebrw, sat_ebrw_25th, sat_ebrw_75th = None, None, None
    if ('average' in fresh_grades[sat_ebrw_index]):
        avg_sat_ebrw = int(fresh_grades[sat_ebrw_index].split()[0])
        sat_ebrw_index += 1 
    if ('range of middle 50%' in fresh_grades[sat_ebrw_index]):
        d = fresh_grades[sat_ebrw_index].split()[0].split('-')
        sat_ebrw_25th = int(d[0])
        sat_ebrw_75th =	int(d[1])
        
    avg_act_comp, act_comp_25th, act_comp_75th = None, None, None
    if ('average' in fresh_grades[act_comp_index]):
        avg_act_comp = int(fresh_grades[act_comp_index].split()[0])
        act_comp_index += 1
    if ('range of middle 50%' in fresh_grades[act_comp_index]):
        d = fresh_grades[act_comp_index].split()[0].split('-')
        act_comp_25th = int(d[0])
        act_comp_75th = int(d[1])
    #print(avg_gpa)
    #print(avg_sat_math, sat_math_25th, sat_math_75th)
    #print(avg_act_comp, act_comp_25th, act_comp_75th)
    #print(avg_sat_ebrw, sat_ebrw_25th, sat_ebrw_75th)
    
    # Cost of School
    # based on the former seeker, because cost is right after grades
    for x in range(0, 3):
        data = data.next_sibling
    for x in range(0, 3):
        data = data.next_element
    cost = [d.strip() for d in data.strings if d!=None and d.strip()!='']
    index = cost.index('Cost of Attendance')+1
    in_state, out_state = None, None
    if ('In-state:' in cost[index]):
        # 'In-state: $26,091', 'Out-of-state: $43,761'
        in_state = cost[index].split()[1].replace(',','')[1:]
        index += 1
    if ('Out-of-state:' in cost[index]):
        out_state = cost[index].split()[1].replace(',','')[1:]
    
    # Student Population Statss:
    # <div class="statbar">
    data = soup.find("div", {"class":"statbar"})
    pop_stats = [stat.strip() for stat in data.strings if stat.strip()!='']
    # pop_stats not used...

    data = soup.find("h2", string="Undergraduate Retention and Graduation")
    data = data.next_sibling.next_sibling.next_sibling.next_sibling
    survival_stats = [d.strip() for d in data.strings if d.strip()!='']
    # we only want completeion rate within 4 years from this:
    index = survival_stats.index('Students Graduating Within 4 Years')+1
    completion_rate = float(survival_stats[index].strip().replace('%',''))

    # print(majors)
    # print(fresh_grades)
    # print(pop_stats)
    # print(cost)
    
    return {'avg gpa':avg_gpa, 'avg sat math':avg_sat_math,
            '25th sat math':sat_math_25th, '75th sat math':sat_math_75th,
            'avg sat ebrw':avg_sat_ebrw, '25th sat ebrw':sat_ebrw_25th,
            '75th sat ebrw':sat_ebrw_75th, 'avg act':avg_act_comp,
            '25th act':act_comp_25th, '75th act': act_comp_75th,
            'in cost':in_state, 'out cost':out_state,
            'majors':majors, 'completion_rate':completion_rate}
    return {'majors':majors, 'freshman grades':fresh_grades, 'cost':cost,
            'pop_stats':pop_stats}


def update_college_scorecard(name):
    data = get_college_data_data(name)
    

# tests:
# print(get_college_ranking())
print(get_college_data_data("Stony Brook University"))
