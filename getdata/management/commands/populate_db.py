
from django.core.management.base import BaseCommand
from getdata.models import Statistic, Indicator
from chicagomap.models import Domain

import pandas as pd
from datetime import date
import csv

# python manage.py populate_db
class Command(BaseCommand):
    def extract_tract(self, geoid):
        # 17031835600
        # (state) 1-2 (county) 3-5 (census tract) 6-end
        # last 8 to get the right county and census tract
        pass









    # this is a method that creates a dataframe from a url and creates Django objects from that
    def _put_population(self):

        # delete existing population table
        Statistic.objects.all().delete()
        Indicator.objects.all().delete()

        # get all Tract objects
        tracts = Domain.objects.filter(domain_name="Census Tract")
        pop_indicator = Indicator(name="population", description="Population by Census Tract", domain_name="Census Tract")
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

        print("Done reading population data!")

    def _put(self):
        # delete existing  table
        Statistic.objects.all().delete()
        Indicator.objects.all().delete()



        with open('datasource.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            for line in csv_reader:
                # percapitaincome,Neighborhood,https:...,PER CAPITA INCOME ,COMMUNITY AREA NAME,per capita income by neighborhood
                dataset_name, domain_type, url, statistic_col, domain_col, description = line

                # get all domain objects of domain_type
                domains = Domain.objects.filter(domain_name=domain_type)

                indicator = Indicator(name=dataset_name,description=description)
                indicator.save()

                # create dataframe from dataset information
                # TODO: try to cover csv, json, etc. formats
                df = pd.read_csv(url, usecols=[domain_col, statistic_col])

                for domain in domains:

                    # pull row with corresponding neighborhood name
                    row = df.loc[df[domain_col] == domain.name]


                    # currently hard coding start and end dates
                    date_ingested = date.today()

                    # in case the domain in our database is not available in dataset
                    new_statistic = None
                    if not row.empty:
                        # pull statistic
                        # TODO: what happens if statistic is not necessarily of int type
                        statistic = row.iloc[0][statistic_col]

                        # create object and save
                        new_statistic = Statistic(domain=domain, value=int(statistic), date_ingested=date_ingested, indicator=indicator)
                    else:
                        # create "null" object and save
                        new_statistic = Statistic(domain=domain, value=0, date_ingested=date_ingested, indicator=indicator)
                    new_statistic.save()

                print(f'Done reading {dataset_name} data!')



    def handle(self, *args, **options):
            self._put_population()
            self._put()
