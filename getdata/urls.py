from django.urls import path, include
from .views import *

urlpatterns = [

    path('general/', view_general_data),

    path('transit/view/', view_transit_data),
    path('healthcare/view/', view_healthcare_data),

]