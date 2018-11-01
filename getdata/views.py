from rest_framework.response import Response
from rest_framework.decorators import api_view
import ast

from .serializers import *
from chicagomap.models import Equivalency, Domain
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

        result = {}
        equivalency_table = None
        index = None

        if domain == "neighborhoods":
            equivalency_table = Equivalency.objects.filter(
                Q(geom_a__domain_name="Neighborhood") | Q(geom_b__domain_name="Neighborhood"))
            domain_table = list(Domain.objects.filter(domain_name="Neighborhood").values('name'))
            index = "neighborhood_id"
        elif domain == "zips":
            equivalency_table = Equivalency.objects.filter(
                Q(geom_a__domain_name="ZIP Code") | Q(geom_b__domain_name="ZIP Code"))
            domain_table = list(Domain.objects.filter(domain_name="ZIP Code").values('name'))
            index = "zip_id"
        elif domain == "wards":
            equivalency_table = Equivalency.objects.filter(
                Q(geom_a__domain_name="Ward") | Q(geom_b__domain_name="Ward"))
            domain_table = list(Domain.objects.filter(domain_name="Ward").values('name'))
            index = "ward_id"
        elif domain == "precincts":
            equivalency_table = Equivalency.objects.filter(
                (Q(geom_a__domain_name="Precinct") | Q(geom_b__domain_name="Precinct")))
            domain_table = list(Domain.objects.filter(domain_name="Precinct").values('name'))
            index = "precinct_id"
        elif domain == "tracts":
            equivalency_table = Equivalency.objects.filter(
                (Q(geom_a__domain_name="Tract") | Q(geom_b__domain_name="Tract")))
            domain_table = list(Domain.objects.filter(domain_name="Tract").values('name'))
            index = "tract_id"

        for row in equivalency_table:
            pop_at_tract = Statistic.objects.filter(domain_id=row.domain_id)[0].value

            if getattr(row, index) in result.keys():
                result[getattr(row, index)] += pop_at_tract * row.pct
            else:
                result[getattr(row, index)] = pop_at_tract * row.pct

        if domain == "neighborhoods":
            for neighborhood in domain_table:
                neighborhood['pop_100'] = result[neighborhood['id']]
        elif domain == "wards":
            for ward in domain_table:
                ward['pop_100'] = result[ward['id']]
        elif domain == "zips":
            for zipcode in domain_table:
                zipcode['pop_100'] = result[zipcode['id']]
        elif domain == "precincts":
            for precinct in domain_table:
                precinct['pop_100'] = result[precinct['id']]

        return domain_table


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
    """
        get: returns entire table (domain: tract)
        post: send body for specific domains e.g. "{neighborhoods": ["Chicago Loop", "Wicker Park"]}
    """
    if request.method == 'GET':
        serializer = StatisticSerializer(Statistic.objects.all(), many=True)
        return Response(serializer.data)


@api_view(['GET'])
def population_list_wards(request):
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
