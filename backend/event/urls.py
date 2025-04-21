from django.urls import path
from .views import eventcategory, event, get_specific_event_data, activate_category, deactivate_category, activate_event, deactivate_event

urlpatterns = [
    path('category/', eventcategory, name='event-category'),
    path('', event, name='event'),
    path('<int:event_id>/', get_specific_event_data, name='get-specific-event-data'),
    path("category/<int:category_id>/activate/", activate_category, name="activate_category"),
    path("category/<int:category_id>/deactivate/", deactivate_category, name="deactivate_category"),
    path("event/<int:event_id>/activate/", activate_event, name="activate_category"),
    path("event/<int:event_id>/deactivate/", deactivate_event, name="deactivate_category"),
    path("event/<int:id>/", event, name="edit-event"),
]

