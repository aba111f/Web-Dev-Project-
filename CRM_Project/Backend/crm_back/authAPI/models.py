from django.db import models

# Create your models here.
class Profile(models.Model):
    username = models.CharField(max_length=100, unique=True)
    FirstName = models.CharField(max_length=100)
    LastName = models.CharField(max_length=100)
    password = models.CharField(max_length=255)
    mail = models.EmailField(max_length=255)
    phone_num = models.CharField(max_length=100)
    age = models.IntegerField()
    PhotoFileName = models.CharField(max_length=100)
    BussinesName=models.CharField(max_length=100)
    logoName=models.CharField(max_length=100)

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












