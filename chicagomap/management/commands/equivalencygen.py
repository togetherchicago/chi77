from django.core.management.base import BaseCommand
from chicagomap.models import Tract, Neighborhood, Precinct, Ward, Zip


for neighborhood in Neighborhood.objects:

