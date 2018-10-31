from django.contrib.gis import admin
from .models import Domain

admin.site.register(Domain, admin.OSMGeoAdmin)