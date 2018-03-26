from django.db import models
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood

# Create your models here.


class {{ dataset_name }}(models.Model):
    {{ indicator.domain }} = models.ForeignKey({{ indicator.domain }}, on_delete=models.CASCADE)
    {{ indicator.column }} = models.IntegerField(default=0)

    def __str__(self):
        return self.{{ indicator.domain }}.name