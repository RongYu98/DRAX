from mongoengine import Document, StringField, BooleanField, FloatField, IntField, ReferenceField, ListField

class Account(Document):
    username = StringField(required=True, max_length=32, unique=True)
    hashed_password = StringField(required=True, max_length=256)
    salt = StringField(required=True, max_length=256)
    type = StringField(choices=('Student', 'Admin'), required=True)

class StudentProfile(Document):
    gpa = FloatField(min_value=0.0, max_value=5.0) # unweighted GPA goes up to 5.0?

    # TODO: how do we store this? as a separate document? or broken up into different fields? 
    grades = {}

    residence_state = StringField(required=True, max_length=2) # store state acronym. 
    college_class = IntField(min_value=2016, max_value=3000)

class College(Document):
    name = StringField(required=True, max_length=50, unique=True)
    # Longest college name in colleges.txt is 50 characters:
    # SUNY College of Environmental Science and Forestry
    city = StringField(required=True, max_length=30)
    state = StringField(required=True, max_length=2)
    region = StringField(required=True, max_length=10)
    institution = StringField(required=True, max_length=20)
    admission_rate = FloatField()
    size = StringField(required=True, max_length=6)
    median_debt = StringField(required=True, max_length=6)
    cost = StringField(max_length=6)
    majors = ListField()
    ranking = StringField(max_length=4)
    avg_sat_math = IntField(max_length=3)
    sat_math_25 = IntField(max_length=3)
    sat_math_75 = IntField(max_length=3)
    avg_sat_ebrw = IntField(max_length=3)
    sat_ebrw_25 = IntField(max_length=3)
    sat_ebrw_75 = IntField(max_length=3)
    avg_act_composite = IntField(max_length=2)
    act_composite_25 = IntField(max_length=2)
    act_composite_75 = IntField(max_length=2)
    
class Application(Document):
    # TODO: add cascade, so if student deleted, delete this too?
    student = ReferenceField(Account, required=True) # reference the student account 
    college = ReferenceField(College, required=True) # reference the college?
    status = StringField(choices=('Pending', 'Accepted', 'Rejected',
                                  'Waitlisted'), required=True)
    application_id = StringField() # not sure if this is needed.
    is_verified = BooleanField() # make this required later?

    
