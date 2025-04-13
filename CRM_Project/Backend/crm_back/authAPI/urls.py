from django.contrib import admin
from django.urls import path
from .views import *

urlpatterns = [
    path('Profiles/<int:id>/', getUser.as_view()),
    path('getData/', DataProfile.as_view()),
    path('Graphics/ActiveClients/',getGraphicsActiveClients.as_view()),
    path('Graphics/ActiveProjects/',getGraphicsActiveProjects.as_view()),
    path('Graphics/QuarterlyRevenue/',getGraphicsQuarterlyRevenue.as_view()),
    path('Graphics/TotalProfit/',getGraphicsTotalProfit.as_view())
]
