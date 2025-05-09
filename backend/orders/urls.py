from django.urls import path
from .views import (
    OrderCheckoutView,
    AllOrdersAdminView,
    OrderDetailsView,
    DashboardStatsView,
    UpdateOrderStatusView
)

urlpatterns = [
    path('checkout/', OrderCheckoutView.as_view(), name='order-checkout'),
    path('orders/', AllOrdersAdminView.as_view(), name='admin-all-orders'),
    path('orders/<int:order_id>/', OrderDetailsView.as_view(), name='admin-order-detail'),
    path('stats/', DashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('orders/<int:order_id>/update-status/', UpdateOrderStatusView.as_view(), name='update-order-status'),
]
