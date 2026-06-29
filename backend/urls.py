from django.urls import path
from .views import *


urlpatterns = [

path(
"",
index
),

path(
"signup/",
api_signup
),

path(
"login/",
api_login
),

path(
"logout/",
api_logout
),

path(
"check/",
check_login
)

]