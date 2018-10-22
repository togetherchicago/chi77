from django.db import models
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood

# Create your models here.


# class Population(models.Model):
#     census_tract = models.ForeignKey(Tract, on_delete=models.CASCADE)
#     pop_100 = models.IntegerField(default=0)
#     start_date = models.DateTimeField(null=True)
#     end_date = models.DateTimeField(null=True)
#
#     def __str__(self):
#         return self.census_tract.name10



###### Revised models.py for new schema below ####
class Indicator(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256)

class Dataset(models.Model):
    id = models.AutoField(primary_key=True)
    dateIngested = models.DateField(null=True)
    indicator = models.ForeignKey('Indicator', on_delete=models.CASCADE)
    startDate = models.DateField(null=True)
    endDate = models.DateField(null=True)

class Statistic(models.Model):
    id = models.AutoField(primary_key=True)
    value = models.IntegerField
    indicator = models.ForeignKey('Indicator', on_delete=models.CASCADE)
    # TODO: not sure which domain to trace this back to
    domain = models.ForeignKey('Tract', on_delete=models.CASCADE)
    dataset = models.ForeignKey('Dataset', on_delete=models.CASCADE)
    dateIngested = models.DateField(null=True)
