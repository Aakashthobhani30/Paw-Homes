from django.urls import path
from .views import industry, industrytag

urlpatterns = [
    path('industry/', industry, name='industry'),
    path('industry/tag/', industrytag, name='industry-tag'),
]
