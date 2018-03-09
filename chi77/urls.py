"""chi77 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib.gis import admin
from django.urls import path, include
from getdata import views as api
from rest_framework_swagger.views import get_swagger_view

schema_view = get_swagger_view(title='API Documentation')

urlpatterns = [
    path('docs/', schema_view),
    path('admin/', admin.site.urls),
    path('api/population/', api.population_list),
    path('api/domain/', api.domain_list),
    path('api/domain/tracts/', api.tract_list),
    path('api/domain/zips/', api.zip_list),
    path('api/domain/neighborhoods/', api.neighborhood_list),
    path('api/domain/precincts/', api.precinct_list),
    path('api/domain/wards/', api.ward_list)
]
