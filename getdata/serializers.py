from rest_framework import serializers
from .models import Population
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood

class PopulationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Population
        fields = ("id", "census_tract", "pop_100")

class WardToTractGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Tract
        geo_field = "geom"
        fields = '__all__'

class PrecinctGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Precinct
        geo_field = "geom"
        exclude = ('ward', 'neighborhoods', 'zips', 'tracts')

class TractGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Tract
        geo_field = "geom"
        exclude = ('precincts', 'neighborhoods', 'zips', 'notes')

class WardGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Ward
        geo_field = "geom"
        exclude = ('tracts', 'neighborhoods', 'zips')

class NeighborGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Neighborhood
        geo_field = "geom"
        exclude = ('precincts', 'wards', 'zips')

class ZipGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Zip
        geo_field = "geom"
        exclude = ('precincts', 'wards', 'neighborhoods', 'tracts')
