
from django.core.management.base import BaseCommand
from getdata.models import Statistic, Indicator
from chicagomap.models import Domain

import pandas as pd
from datetime import date


class Command(BaseCommand):
    # python manage.py populate_db

    # this is a method that creates a dataframe from a url and creates Django objects from that
    def _put_population(self):

        # delete existing population table
        Statistic.objects.all().delete()
        Indicator.objects.all().delete()

        # get all Tract objects
        tracts = Domain.objects.filter(domain_name="Census Tract")
        pop_indicator = Indicator(name="Population", description="Population by Census Tract")
        pop_indicator.save()
        # create dataframe
        url = "http://censusdata.ire.org/17/all_140_in_17.P1.csv"
        df = pd.read_csv(url, usecols=['GEOID', 'NAME', 'POP100'])

        # find relevant census tracts in population csv
        for tract in tracts:

            # pull row with corresponding geoid
            row = df.loc[df['NAME'] == (tract.domain_name) + ' ' + (tract.name)]

            # clean census tract number column
            census_tract = row.iloc[0]['NAME']
            census_tract = ''.join(filter(lambda x: x.isdigit() or x == '.', census_tract))

            # sanity check
            if census_tract == tract.name:

                # pull statistic
                pop_100 = row.iloc[0]['POP100']

                # currently hard coding start and end dates
                date_ingested = date.today()
                # create object and save
                new_pop = Statistic(domain=tract, value=int(pop_100), date_ingested=date_ingested, indicator=pop_indicator)
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
