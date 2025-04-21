from django.urls import path
from .views import contactdetail, contactformlist, contactformview

urlpatterns = [
    path('contactdetails/', contactdetail, name='contact-detail'),
    path('contactformslist/', contactformlist, name='contact-form-list'),
    path('contactformsview/<int:id>/', contactformview, name='contact-form-view'),
]
