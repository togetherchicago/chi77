from django.contrib.gis import admin
from .models import Ward, Precinct, Zip, Tract, Neighborhood

admin.site.register(Ward, admin.OSMGeoAdmin)
admin.site.register(Precinct, admin.OSMGeoAdmin)
admin.site.register(Zip, admin.OSMGeoAdmin)
admin.site.register(Tract, admin.OSMGeoAdmin)
admin.site.register(Neighborhood, admin.OSMGeoAdmin)
