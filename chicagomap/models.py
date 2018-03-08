# This is an auto-generated Django model module created by ogrinspect.
from django.contrib.gis.db import models


class Tract(models.Model):
    statefp10 = models.CharField(max_length=64)
    name10 = models.CharField(max_length=64, primary_key=True)
    commarea_n = models.CharField(max_length=64)
    namelsad10 = models.CharField(max_length=64)
    commarea = models.CharField(max_length=64)
    geoid10 = models.CharField(max_length=64)
    notes = models.CharField(max_length=64)
    tractce10 = models.CharField(max_length=64)
    countyfp10 = models.CharField(max_length=64)
    precincts = models.ManyToManyField('Precinct', through='TractToPrecinct')
    wards = models.ManyToManyField('Ward', through='WardToTract')
    zips = models.ManyToManyField('Zip', through='ZipToTract')
    neighborhoods = models.ManyToManyField('Neighborhood', through='NeighborhoodToTract')
    geom = models.MultiPolygonField()

    def __str__(self):
        return self.name10


# Auto-generated `LayerMapping` dictionary for Tracts model
tract_mapping = {
    'statefp10': 'statefp10',
    'name10': 'name10',
    'zips': 'zip',
    'precincts': 'precincts',
    'wards': 'wards',
    'neighborhoods': 'neighborhoods',
    'commarea_n': 'commarea_n',
    'namelsad10': 'namelsad10',
    'commarea': 'commarea',
    'geoid10': 'geoid10',
    'notes': 'notes',
    'tractce10': 'tractce10',
    'countyfp10': 'countyfp10',
    'geom': 'MULTIPOLYGON',
}


class Precinct(models.Model):
    shape_area = models.CharField(max_length=64)
    precinct = models.CharField(max_length=64)
    ward = models.CharField(max_length=64)
    full_text = models.CharField(max_length=64)
    shape_len = models.CharField(max_length=64)
    tracts = models.ManyToManyField('Tract', through='TractToPrecinct')
    neighborhoods = models.ManyToManyField('Neighborhood', through='NeighborhoodToPrecinct')
    zips = models.ManyToManyField('Zip', through='ZipToPrecinct')
    geom = models.MultiPolygonField()

    def __str__(self):
        return self.full_text


# Auto-generated `LayerMapping` dictionary for Precincts model
precinct_mapping = {
    'shape_area': 'shape_area',
    'precinct': 'precinct',
    'ward': 'ward',
    'zips': 'zips',
    'tracts': 'tracts',
    'neighborhoods': 'neighborhoods',
    'full_text': 'full_text',
    'shape_len': 'shape_len',
    'geom': 'MULTIPOLYGON',
}


class Zip(models.Model):
    objectid = models.CharField(max_length=64)
    shape_len = models.CharField(max_length=64)
    zip = models.CharField(max_length=64)
    shape_area = models.CharField(max_length=64)
    tracts = models.ManyToManyField(Tract, through='ZipToTract')
    precincts = models.ManyToManyField(Precinct, through='ZipToPrecinct')
    wards = models.ManyToManyField('Ward', through='ZipToWard')
    neighborhoods = models.ManyToManyField('Neighborhood', through='NeighborhoodToZip')
    geom = models.MultiPolygonField()

    def __str__(self):
        return self.zip


# Auto-generated `LayerMapping` dictionary for Zips model
zip_mapping = {
    'objectid': 'objectid',
    'shape_len': 'shape_len',
    'zip': 'zip',
    'tracts': 'tracts',
    'precincts': 'precincts',
    'wards': 'wards',
    'neighborhoods': 'neighborhoods',
    'shape_area': 'shape_area',
    'geom': 'MULTIPOLYGON',
}


class Ward(models.Model):
    ward = models.CharField(max_length=64)
    shape_area = models.CharField(max_length=64)
    shape_leng = models.CharField(max_length=64)
    tracts = models.ManyToManyField(Tract, through='WardToTract')
    neighborhoods = models.ManyToManyField('Neighborhood', through='NeighborhoodToWard')
    zips = models.ManyToManyField(Zip, through='ZipToWard')
    geom = models.MultiPolygonField()

    def __str__(self):
        return self.ward


# Auto-generated `LayerMapping` dictionary for Wards model
ward_mapping = {
    'ward': 'ward',
    'zips': 'zip',
    'tracts': 'tracts',
    'neighborhoods': 'neighborhoods',
    'shape_area': 'shape_area',
    'shape_leng': 'shape_leng',
    'geom': 'MULTIPOLYGON',
}


class Neighborhood(models.Model):
    shape_area = models.CharField(max_length=64)
    pri_neigh = models.CharField(max_length=64)
    sec_neigh = models.CharField(max_length=64)
    shape_len = models.CharField(max_length=64)
    tracts = models.ManyToManyField(Tract, through='NeighborhoodToTract')
    precincts = models.ManyToManyField(Precinct, through='NeighborhoodToPrecinct')
    wards = models.ManyToManyField(Ward, through='NeighborhoodToWard')
    zips = models.ManyToManyField(Zip, through='NeighborhoodToZip')
    geom = models.MultiPolygonField()

    def __str__(self):
        return self.pri_neigh


neighborhood_mapping = {
    'shape_area': 'shape_area',
    'pri_neigh': 'pri_neigh',
    'sec_neigh': 'sec_neigh',
    'shape_len': 'shape_len',
    'tracts': 'tracts',
    'precincts': 'precincts',
    'wards': 'wards',
    'zips': 'zips',
    'geom': 'MULTIPOLYGON',
}


class NeighborhoodToTract(models.Model):
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.SET_NULL, null=True)
    tract = models.ForeignKey(Tract, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class NeighborhoodToPrecinct(models.Model):
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.SET_NULL, null=True)
    precinct = models.ForeignKey(Precinct, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class NeighborhoodToWard(models.Model):
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.SET_NULL, null=True)
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class NeighborhoodToZip(models.Model):
    neighborhood = models.ForeignKey(Neighborhood, on_delete=models.SET_NULL, null=True)
    zip = models.ForeignKey(Zip, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class ZipToTract(models.Model):
    zip = models.ForeignKey(Zip, on_delete=models.SET_NULL, null=True)
    tract = models.ForeignKey(Tract, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class ZipToWard(models.Model):
    zip = models.ForeignKey(Zip, on_delete=models.SET_NULL, null=True)
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class ZipToPrecinct(models.Model):
    zip = models.ForeignKey(Zip, on_delete=models.SET_NULL, null=True)
    precinct = models.ForeignKey(Precinct, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class WardToTract(models.Model):
    ward = models.ForeignKey(Ward, on_delete=models.SET_NULL, null=True)
    tract = models.ForeignKey(Tract, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()


class TractToPrecinct(models.Model):
    tract = models.ForeignKey(Tract, on_delete=models.SET_NULL, null=True)
    precinct = models.ForeignKey(Precinct, on_delete=models.SET_NULL, null=True)
    geom = models.MultiPolygonField()
