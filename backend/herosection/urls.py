from django.urls import path
from .views import hero_list, get_specific_hero_data, activate_hero, deactivate_hero, hero_detail

urlpatterns = [
    path('', hero_list, name='hero'),
    path('<int:hero_id>/', get_specific_hero_data, name='get-specific-hero-data'),
    path('<int:hero_id>/activate', activate_hero, name='activate-hero'),
    path('<int:hero_id>/deactivate', deactivate_hero, name='deactivate-hero'),
    path('edit/<int:id>/', hero_detail, name= 'edit-hero'),
]