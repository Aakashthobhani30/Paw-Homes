from django.urls import path
from .views import (
    adoption,
    activate_adoption,
    deactivate_adoption,
    get_specific_adoption_data,
)

urlpatterns = [
    path('', adoption, name='adoption'),
    path('adoption/<int:id>/', adoption, name='edit-adoption'),
    path('adoption/<int:adoption_id>/activate/', activate_adoption, name='activate_adoption'),
    path('adoption/<int:adoption_id>/deactivate/', deactivate_adoption, name='deactivate_adoption'),
    path('<int:adoption_id>/', get_specific_adoption_data, name='get_specific_adoption_data'),
]
