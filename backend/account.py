from mongoengine import Document, StringField
class Account(Document):
    username = StringField(required=True, max_length=32, unique=True)
    hashedPassword = StringField(required=True, max_length=256)
    salt = StringField(required=True, max_length=256)
