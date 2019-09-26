from django.contrib.gis.db import models as geomodels
from django.db import models


class Domain(models.Model):
    geom = geomodels.MultiPolygonField()
    domain_name = models.CharField(max_length=64, default='')
    name = models.CharField(max_length=64)


class Equivalency(models.Model):
    geom_a = models.ForeignKey(Domain, related_name='geom_a', on_delete=models.SET_NULL, null=True)
    geom_b = models.ForeignKey(Domain, related_name='geom_b', on_delete=models.SET_NULL, null=True)
    intersection = geomodels.MultiPolygonField()
    pct_a = models.FloatField(null=True)
    pct_b = models.FloatField(null=True)


class Indicator(models.Model):
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256, null=True)
    domain_name = models.CharField(max_length=256, null=True)


class Dataset(models.Model):
    date_ingested = models.DateField(null=True)
    indicator = models.ForeignKey('Indicator', on_delete=models.CASCADE)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)


class Statistic(models.Model):
    value = models.IntegerField()
    indicator = models.ForeignKey('Indicator', on_delete=models.CASCADE, null=True)
    domain = models.ForeignKey(Domain, on_delete=models.CASCADE)
    dataset = models.ForeignKey('Dataset', on_delete=models.CASCADE, null=True)
    date_ingested = models.DateField(null=True)
