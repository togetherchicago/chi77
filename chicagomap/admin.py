from django.contrib.gis import admin
from .models import Domain, DomainMeta

admin.site.register(Domain, admin.OSMGeoAdmin)
admin.site.register(DomainMeta, admin.OSMGeoAdmin)
