from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager

class ProfileManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if not username:
            raise ValueError('Username is required')
        groups = extra_fields.pop('groups', [])
        permissions = extra_fields.pop('user_permissions', [])
        extra_fields.setdefault('is_active', True)
        user = self.model(username=username, **extra_fields)
        user.password = password 
        user.save()

        if groups:
            user.groups.set(groups)
        if permissions:
            user.user_permissions.set(permissions)

        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class Profile(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    FirstName = models.CharField(max_length=100)
    LastName = models.CharField(max_length=100)
    mail = models.EmailField(max_length=255, unique=True)
    phone_num = models.CharField(max_length=100, unique=True)
    age = models.IntegerField(null=True)
    PhotoFileName = models.ImageField(upload_to='images/photo/')
    BussinesName = models.CharField(max_length=100)
    logoName = models.ImageField(upload_to='images/logo/')

  
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = ProfileManager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['mail']

    def __str__(self):
        return f"{self.FirstName} {self.LastName}"

    
class TotalProfit(models.Model):
    date = models.DateField()
    profit = models.FloatField()

    def __str__(self):
        return str(self.profit)

class ActiveClient(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

# class QuarterlyRevenue(models.Model):
#     quarter = models.CharField(max_length=10)
#     revenue = models.FloatField()

#     def __str__(self):
#         return str(self.revenue)

class ActiveProject(models.Model):
    title = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title












