from mongoengine import Document, StringField, BooleanField, FloatField, IntField, ReferenceField

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
    name = StringField(required=True, max_length=128, unique=True)
    # TODO: to be filled in  
    
class Application(Document):
    # TODO: add cascade, so if student deleted, delete this too?
    student = ReferenceField(Account, required=True) # reference the student account 
    college = ReferenceField(College, required=True) # reference the college?
    status = StringField(choices=('Pending', 'Accepted', 'Rejected',
                                  'Waitlisted'), required=True)
    application_id = StringField() # not sure if this is needed.
    is_verified = BooleanField() # make this required later?

    
