from django.urls import path
from .views import newscategors, news, newscomment, newsletter

urlpatterns = [
    path('news/category/', newscategors, name='newscategory'),
    path('news/', news, name='news'),
    path('news/comment/', newscomment, name='news-comment'),
    path('news/letter/', newsletter, name='news-letter'),
]
