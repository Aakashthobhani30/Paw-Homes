from django.urls import path
from .views import blog, blogcomment, blogcategory, activate_blog, deactivate_blog, get_specific_blog_data

urlpatterns = [
    path('blog/categories/', blogcategory, name='blog-category'),
    path('', blog, name='blog'),
    path('blog/<int:blog_id>/comments/', blogcomment, name='blog-comment'),
    path("blog/<int:blog_id>/activate/", activate_blog, name="activate_blog"),
    path("blog/<int:blog_id>/deactivate/", deactivate_blog, name="deactivate_blog"),
    path("<int:blog_id>/", get_specific_blog_data, name="get-specific-blog-data"),
    path("blog/<int:id>/", blog, name="edit-blog"),
    path("", blog, name="save-blog"),
]