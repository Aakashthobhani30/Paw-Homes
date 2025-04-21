from django.contrib import admin
from django.urls import path, include
from user.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refersh"),
    path("api-auth/", include("rest_framework.urls")),   
    path("api/", include("api.urls")),
    path('api/about/', include("aboutus.urls")),
    path('api/blog/', include("blog.urls")),
    path('api/casestudy/', include("casestudy.urls")),
    path('api/contactdetail/', include("contactdetail.urls")),
    path('api/events/', include("event.urls")),
    path('api/industry/', include("industry.urls")),
    path('api/news/', include("news.urls")),
    path('api/product/', include("product.urls")),
    path('api/services/', include("services.urls")),
    path('api/adoption/', include("adoption.urls")),
    path('api/user/', include("user.urls")),
    path('api/hero/', include("herosection.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
