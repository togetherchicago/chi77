from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from getdata.models import Statistic, Indicator
from chicagomap.models import Domain


class StatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Statistic
        fields = '__all__'


class DomainGeoSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Domain
        geo_field = "geom"
        fields = '__all__'


class IndicatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indicator
        fields = '__all__'
