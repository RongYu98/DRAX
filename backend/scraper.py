import urllib.request # for connecting and getting html content
from bs4 import BeautifulSoup # for parsing html

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
    print(data[0:10])
    
    #  print(d.next_element)
    # print(d.next_element.next_element)
    #for s in d.strings:
    #    print(s)
    # Rank, Name, Country/Region, Tuition and Fees, Room and Board, Salary after 10 years
    #for t in ['Rank', 'Name', 'Country/Region', 'Tuitio
    #print(type(d))
    # print(d)

def get_college_data_data(name):
    name = name.replace(' ', '-') # stony brook becomes stony-brook
    url = 'http://allv22.all.cs.stonybrook.edu/~stoller/cse416/collegedata/'
    url = url + name

    majors = []
    fresh_grades = []
    pop_stats = []
    
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

    # Student Population Statss:
    # <div class="statbar">
    data = soup.find("div", {"class":"statbar"})
    pop_stats = [stat.strip() for stat in data.strings if stat.strip()!='']

    print(majors)
    print(fresh_grades)
    print(pop_stats)

    # can scrape so much more data...
    
# tests:
# print(get_college_ranking())
print(get_college_data_data("Stony Brook University"))
