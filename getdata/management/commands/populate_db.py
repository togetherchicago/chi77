
from django.core.management.base import BaseCommand
from getdata.models import Population
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood

import pandas as pd


class Command(BaseCommand):
    # python manage.py populate_db

    def _put_population(self):

        # delete everything in the table
        Population.objects.all().delete()
        print("Reading Population data...")
        url = "http://censusdata.ire.org/17/all_140_in_17.P1.csv"
        c = pd.read_csv(url, usecols=[8,9])
        for entry in c.iterrows():
            # cleaning census tract number column
            census_tract = ''.join(filter(lambda x: x.isdigit() or x == '.', entry[1]['NAME']))
            find_tract = Tract.objects.filter(name10=census_tract)
            # if tract is in chicago
            if find_tract:
                # pull corresponding pop100
                pop_100 = entry[1]['POP100']
                # create object with foreign key to tract table
                tract = Population(census_tract=find_tract[0], pop_100=pop_100)
                tract.save()
                print("Population @ tract ", find_tract[0], " saved.")

        print("Done reading population data!")


    def handle(self, *args, **options):
        self._put_population()