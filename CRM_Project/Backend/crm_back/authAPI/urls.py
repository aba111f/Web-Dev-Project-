from django.contrib import admin
from django.urls import path, re_path
from .views import *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('profiles/<int:id>/', getUser.as_view()),
    path('profiles/', DataProfile.as_view()),
    path('Graphics/ActiveClients/<int:id>/',getGraphicsActiveClients.as_view()),
    path('Graphics/ActiveProjects/<int:id>/',getGraphicsActiveProjects.as_view()),
    path('Graphics/TotalProfit/<int:id>/',getGraphicsTotalProfit.as_view(), name='login'),
    path('login/', CustomLoginView.as_view()),
    # path('files/upload/', SaveFile),
] 

