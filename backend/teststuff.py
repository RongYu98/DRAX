from mongoengine import *
from classes import Application, HighSchool



connect('account', host='localhost', port=27017)
connect('account', host='localhost', port=27017)
connect('college', alias='college')


# data = HighSchool.objects
data = Application.objects
for d in data:
    # print(d.status)
    d.timestamp = "12345"
    # d.scraped = True
    # if d.status=='Rejected':
    #     d.status='Denied'
    # d.verification = "Pending"
    d.save()
