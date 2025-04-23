from django.contrib import admin
from django.urls import path, re_path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('profiles/<int:id>/', actionsWithProfile.as_view()),
    path('profiles/', ListProfile.as_view()),


    # Auth
    path('login/', CustomLoginView.as_view()),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    # Employee
    path('profiles/<int:user_id>/employee/', EmployeeListCreate.as_view()),
    path('profiles/<int:user_id>/employee/<int:pk>/', EmployeeDetail.as_view()),

    # TotalProfit
    path('profiles/<int:user_id>/totalprofit/', TotalProfitListCreate.as_view()),
    path('profiles/<int:user_id>/totalprofit/<int:pk>/', TotalProfitDetail.as_view()),

    # ActiveClient
    path('profiles/<int:user_id>/activeclient/', ActiveClientListCreate.as_view()),
    path('profiles/<int:user_id>/activeclient/<int:pk>/', ActiveClientDetail.as_view()),

    # ActiveProject
    path('profiles/<int:user_id>/activeproject/', ActiveProjectListCreate.as_view()),
    path('profiles/<int:user_id>/activeproject/<int:pk>/', ActiveProjectDetail.as_view()),
] 

