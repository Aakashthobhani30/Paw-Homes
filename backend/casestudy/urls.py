from django.urls import path
from .views import casestudy, casestudycategory, casestudycomment

urlpatterns = [
    path('casestudy/categories/', casestudycategory, name='case-study-category'),
    path('casestudy/', casestudy, name='case-stude'),
    path('casestudy/<int:casestudy_id>/comment/', casestudycomment, name='casr-study-comments'),
]
