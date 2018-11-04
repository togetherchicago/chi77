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
    return serializer.data


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


@api_view(['GET'])
def dataset_list(request, dataset):
    if request.method == 'GET':

        if dataset == "population":
            serializer = StatisticSerializer(Statistic.objects.all(), many=True)
            return Response(serializer.data)

        elif dataset == "domains":
            return Response(content)

        else:
            raise Http404


@api_view(['GET'])
def dataset_list_domain(request, dataset, domain):
    print('dataset_list_domain')
    if request.method == 'GET':

        if dataset == "population":

            if not domain == "tracts":
                res = convert_domain(dataset, domain)
                return Response(res)

            else:
                serializer = StatisticSerializer(Statistic.objects.all(), many=True)
                return Response(serializer.data)

        else:
            raise Http404


@api_view(['GET'])
def dataset_list_date(request, dataset, date):
    print('dataset_list_date')
    if request.method == 'GET':

        if dataset == "population":

            serializer = filter_date(dataset, date)
            return Response(serializer)

        elif dataset == "domains":
            return Response(content)

        else:
            raise Http404


@api_view(['GET'])
def dataset_list_date_domain(request, dataset, date, domain):
    print('dataset_list_date_domain')
    if request.method == 'GET':

        if dataset == "population":

            serializer = filter_date(dataset, date)
            if not domain == "tracts":
                res = convert_domain(dataset, domain, serializer, True)
                return Response(res)
            else:
                return Response(serializer)


        # elif dataset == "domains":

        else:
            raise Http404


# /api/population
# GET returns entire table (domain: tract)
# POST is glorified GET but can send body for specific domains e.g. "{neighborhoods": ["Chicago Loop", "Wicker Park"]}
@api_view(['GET', 'POST'])
def population_list(request):
    print('population_list')
    """
        get: returns entire table (domain: tract)
        post: send body for specific domains e.g. "{neighborhoods": ["Chicago Loop", "Wicker Park"]}
    """
    if request.method == 'GET':
        serializer = StatisticSerializer(Statistic.objects.all(), many=True)
        return Response(serializer.data)


@api_view(['GET'])
def population_list_wards(request):
    print('population_list_wards')
    if request.method == 'GET':
        ward_to_tracts = Equivalency.objects.filter(geom_a__domain_name='Ward', geom_b__domain_name='Census Tract')
        populations = Statistic.objects.all()

        wards = {}

        total = 0

        for object in ward_to_tracts:

            pop_at_tract = Statistic.objects.filter(domain_id=object.tract_id)[0].value

            if object.geom_a.name in wards.keys():
                wards[object.geom_a.name] += pop_at_tract * object.pct
                total += pop_at_tract * object.pct
            else:
                wards[object.geom_a.name] = pop_at_tract * object.pct
                total += pop_at_tract * object.pct

        print(total)

        return Response(wards)


@api_view(['GET'])
def population_list_domain(request, domain):
    print('population_list_domain')
    if request.method == 'GET':
        print("domain:")
        print(domain)
        return Response(domain)


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
