# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class Domain(models.Model):
    geom = models.MultiPolygonField()
    domain_name = models.CharField(max_length=64, default='')
    name = models.CharField(max_length=64)


class Equivalency(models.Model):
    geom_a = models.ForeignKey(Domain, related_name='geom_a', on_delete=models.SET_NULL, null=True)
    geom_b = models.ForeignKey(Domain, related_name='geom_b', on_delete=models.SET_NULL, null=True)
    intersection = models.MultiPolygonField()
    pct_a = models.FloatField(null=True)
    pct_b = models.FloatField(null=True)