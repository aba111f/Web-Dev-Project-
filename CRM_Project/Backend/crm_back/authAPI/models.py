from django.db import models

# Create your models here.
class Profile(models.Model):
    FirstName = models.CharField(max_length=100)
    LastName = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    mail = models.CharField(max_length=255)
    phone_num = models.CharField(max_length=100)
    age = models.IntegerField()
    PhotoFileName = models.CharField()

















# Сен шұлықты теріс киме
# Сендер шұлықты теріс кимеңдер

# Сіз шұлықты теріс кимеңіз
# Сіздер шұлықты теріс кимеңіздер

# Ол шұлықты теріс кимесін
# Олар шұлықты теріс кимесін