from rest_framework.response import Response
from rest_framework.decorators import api_view
import ast

from .serializers import *
from chicagomap.models import Equivalency, Domain
from getdata.models import Indicator, Statistic
from rest_framework import viewsets

from django.http import Http404
from django.http import JsonResponse
from django.core.serializers import serialize
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

import json
import datetime

content = [
    {
        "title": "Census Tracts",
        "description": "Fetch GeoJSON objects of all tracts",
        "method": "GET",
        "domain": "/api/domain/tracts"
    },
    {
        "title": "Wards",
        "description": "Fetch GEOJSON objects of all wards",
        "method": "GET",
        "domain": "/api/domain/wards"
    },
    {
        "title": "Neighborhoods",
        "description": "Fetch GEOJSON objects of all neighborhoods",
        "method": "GET",
        "domain": "/api/domain/neighborhoods"
    },
    {
        "title": "Precincts",
        "description": "Fetch GEOJSON objects of all precincts",
        "method": "GET",
        "domain": "/api/domain/precincts"
    },
    {
        "title": "Zip Codes",
        "description": "Fetch GEOJSON objects of all zip codes",
        "method": "GET",
        "domain": "/api/domain/zipcodes"
    }
]


def filter_date(dataset, date):
    if dataset == "population":
        year, month, day = date.split("-")
        filtered_date = datetime.datetime(int(year), int(month), int(day), 0, 0)
        filtered_list = Statistic.objects.filter(start_date__lte=filtered_date, end_date__gte=filtered_date)
        serializer = StatisticSerializer(filtered_list, many=True)

    if dataset == "income":
        year, month, day = date.split("-")
        filtered_date = datetime.datetime(int(year), int(month), int(day), 0, 0)
        filtered_list = Statistic.objects.filter(start_date__lte=filtered_date, end_date__gte=filtered_date)
        serializer = StatisticSerializer(filtered_list, many=True)

    return serializer.data


def convert_domainv2(indicator_id, domain): 
    print(indicator_id)
    print(domain)


def convert_domain(dataset, domain, filtered={}, sent_filtered=False):
    if dataset == "population":

        statistic_id = Indicator.objects.get(name='Population')

        if domain == "neighborhoods":
            return "neighborhoods"

        elif domain == "zips":
            return "zips"

        elif domain == "wards":
            wards = {}
            ward_to_tracts = Equivalency.objects.filter(geom_a__domain_name="Census Tract", geom_b__domain_name="Ward")

            for eq in ward_to_tracts:
                pop_at_tract = Statistic.objects.filter(indicator=statistic_id, domain=eq.geom_a)[0].value

                if eq.geom_b.name in wards:
                    wards[eq.geom_b.name] += eq.pct * pop_at_tract
                else:
                    wards[eq.geom_b.name] = eq.pct * pop_at_tract

            stat_arr = []
            for ward in wards:
                stat_arr.append(
                    {
                        "domain": int(ward),
                        "value": wards[ward]
                    }
                )
            return stat_arr


        elif domain == "precincts":
            return "precincts"

        elif domain == "tracts":
            return StatisticSerializer(Statistic.objects.filter(indicator=statistic_id), many=True)

        return "none"

    if dataset == "income":

        statistic_id = Indicator.objects.get(name='income')

        if domain == "neighborhoods":
            return "neighborhoods"

        elif domain == "zips":
            return "zips"

        elif domain == "wards":
            wards = {}
            ward_to_tracts = Equivalency.objects.filter(geom_a__domain_name="Census Tract", geom_b__domain_name="Ward")

            for eq in ward_to_tracts:
                pop_at_tract = Statistic.objects.filter(indicator=statistic_id, domain=eq.geom_a)[0].value

                if eq.geom_b.name in wards:
                    wards[eq.geom_b.name] += eq.pct * pop_at_tract
                else:
                    wards[eq.geom_b.name] = eq.pct * pop_at_tract

            stat_arr = []
            for ward in wards:
                stat_arr.append(
                    {
                        "domain": int(ward),
                        "value": wards[ward]
                    }
                )
            return stat_arr


        elif domain == "precincts":
            return "precincts"

        elif domain == "tracts":
            return StatisticSerializer(Statistic.objects.filter(indicator=statistic_id), many=True)

        return "none"


@api_view(['GET'])
def dataset_list(request, dataset):
    if request.method == 'GET':

        if dataset == "domains":
            return Response(content)

        try: 
            indicator_id = Indicator.objects.get(name=dataset)
            serializer = StatisticSerializer(Statistic.objects.filter(indicator=indicator_id), many=True)
            return Response(serializer.data)

        except ObjectDoesNotExist: 
            raise Http404


@api_view(['GET'])
def dataset_list_domain(request, dataset, domain):
    print('dataset_list_domain')
    if request.method == 'GET':

        if dataset == "domains": 
            return Response(content)

        try: 
            indicator_id = Indicator.objects.get(name=dataset)
            res = convert_domainv2(statistic_id, domain)
            return Response(res)
        
        except ObjectDoesNotExist: 
            raise Http404




@api_view(['GET'])
def tract_list(request):
    queryset = Domain.objects.filter(domain_name="Census Tract")
    serializer = DomainGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def zip_list(request):
    queryset = Domain.objects.filter(domain_name="ZIP Code")
    serializer = DomainGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def neighborhood_list(request):
    queryset = Domain.objects.filter(domain_name="Neighborhood")
    serializer = DomainGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def precinct_list(request):
    queryset = Domain.objects.filter(domain_name="Precinct")
    serializer = DomainGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def ward_list(request):
    queryset = Domain.objects.filter(domain_name="Ward")
    serializer = DomainGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def domain_list(request):
    queryset = Domain.objects.all()
    serializer = DomainGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)
