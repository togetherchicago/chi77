from django.db import models
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood

# Create your models here.

class Population(models.Model):
    census_tract = models.ForeignKey(Tract, on_delete=models.CASCADE)
    pop_100 = models.IntegerField(default=0)

    def __str__(self):
        return self.census_tract.name10



