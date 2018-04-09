
from django.core.management.base import BaseCommand
from getdata.models import Population
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood

import pandas as pd
from datetime import date


class Command(BaseCommand):
    # python manage.py populate_db

    # this is a method that creates a dataframe from a url and creates Django objects from that
    def _put_population(self):

        # delete existing population table
        Population.objects.all().delete()

        # get all Tract objects
        tracts = Tract.objects.all()

        # create dataframe
        url = "http://censusdata.ire.org/17/all_140_in_17.P1.csv"
        df = pd.read_csv(url, usecols=['GEOID', 'NAME', 'POP100'])

        # find relevant census tracts in population csv
        for tract in tracts:

            # pull row with corresponding geoid
            row = df.loc[df['GEOID'] == float(tract.geoid10)]

            # clean census tract number column
            census_tract = row.iloc[0]['NAME']
            census_tract = ''.join(filter(lambda x: x.isdigit() or x == '.', census_tract))

            # sanity check
            if census_tract == tract.name10:

                # pull statistic
                pop_100 = row.iloc[0]['POP100']

                # currently hard coding start and end dates
                start_date = date(2010, 1, 1)
                end_date = date(2010, 12, 31)

                # create object and save
                new_pop = Population(census_tract=tract, pop_100=pop_100, start_date=start_date, end_date=end_date)
                new_pop.save()

        # print(df.head)

        # # delete everything in the table
        # Population.objects.all().delete()
        # print("Reading Population data...")
        # url = "http://censusdata.ire.org/17/all_140_in_17.P1.csv"
        # c = pd.read_csv(url, usecols=[8,9])
        # for entry in c.iterrows():
        #     # cleaning census tract number column
        #     census_tract = ''.join(filter(lambda x: x.isdigit() or x == '.', entry[1]['NAME']))
        #     find_tract = Tract.objects.filter(name10=census_tract)
        #     # if tract is in chicago
        #     if find_tract:
        #         # pull corresponding pop100
        #         pop_100 = entry[1]['POP100']
        #         # create object with foreign key to tract table
        #         tract = Population(census_tract=find_tract[0], pop_100=pop_100)
        #         tract.save()
        #         print("Population @ tract ", find_tract[0], " saved.")

        print("Done reading population data!")


    def handle(self, *args, **options):
        self._put_population()