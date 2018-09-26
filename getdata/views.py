from rest_framework.response import Response
from rest_framework.decorators import api_view
import ast

from .models import Population
from .serializers import *
from rest_framework import viewsets

from django.http import Http404
from django.http import JsonResponse
from django.core.serializers import serialize

from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood
from chicagomap.models import WardToTract, NeighborhoodToTract, TractToPrecinct, ZipToTract

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
        filtered_list = Population.objects.filter(start_date__lte=filtered_date, end_date__gte=filtered_date)
        serializer = PopulationSerializer(filtered_list, many=True)
    return serializer.data


def convert_domain(dataset, domain, filtered={}, sent_filtered=False):

    if dataset == "population":

        result = {}
        equivalency_table = None
        index = None

        if domain == "neighborhoods":
            equivalency_table = NeighborhoodToTract.objects.all()
            domain_table = list(Neighborhood.objects.values('id', 'pri_neigh'))
            index = "neighborhood_id"
        elif domain == "zips":
            equivalency_table = ZipToTract.objects.all()
            domain_table = list(Zip.objects.values('zip'))
            index = "zip_id"
        elif domain == "wards":
            equivalency_table = WardToTract.objects.all()
            domain_table = list(Ward.objects.values('ward'))
            index = "ward_id"
        elif domain == "precincts":
            # doesnt work for precincts because A -> B vs B -> A
            equivalency_table = TractToPrecinct.objects.all()
            domain_table = list(Precinct.objects.values('id', 'full_text'))
            index = "precinct_id"

        for row in equivalency_table:
            pop_at_tract = Population.objects.filter(census_tract_id=row.tract_id)[0].pop_100

            if getattr(row, index) in result.keys():
                result[getattr(row, index)] += pop_at_tract * row.pct
            else:
                result[getattr(row, index)] = pop_at_tract * row.pct

        if domain == "neighborhoods":
            for neighborhood in domain_table:
                neighborhood['pop_100'] = result[neighborhood['id']]
        elif domain == "wards":
            for ward in domain_table:
                ward['pop_100'] = result[ward['ward']]
        elif domain == "zips":
            for zip in domain_table:
                zip['pop_100'] = result[zip['zip']]
        elif domain == "precincts":
            for precinct in domain_table:
                precinct['pop_100'] = result[precinct['id']]

        return domain_table


@api_view(['GET'])
def dataset_list(request, dataset):
    if request.method == 'GET':

        if dataset == "population":
            serializer = PopulationSerializer(Population.objects.all(), many=True)
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
                serializer = PopulationSerializer(Population.objects.all(), many=True)
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


#
# # /api/population
# # GET returns entire table (domain: tract)
# # POST is glorified GET but can send body for specific domains e.g. "{neighborhoods": ["Chicago Loop", "Wicker Park"]}
# @api_view(['GET', 'POST'])
# def population_list(request):
#     """
#         get: returns entire table (domain: tract)
#         post: send body for specific domains e.g. "{neighborhoods": ["Chicago Loop", "Wicker Park"]}
#     """
#     if request.method == 'GET':
#         serializer = PopulationSerializer(Population.objects.all(), many=True)
#         return Response(serializer.data)
#
#
# @api_view(['GET'])
# def population_list_wards(request):
#     if request.method == 'GET':
#         ward_to_tracts = WardToTract.objects.all().order_by('ward_id')
#         populations = Population.objects.all()
#
#         wards = {}
#
#         total = 0
#
#         for object in ward_to_tracts:
#
#             pop_at_tract = Population.objects.filter(census_tract_id=object.tract_id)[0].pop_100
#
#             if object.ward_id in wards.keys():
#                 wards[object.ward_id] += pop_at_tract * object.pct
#                 total += pop_at_tract * object.pct
#             else:
#                 wards[object.ward_id] = pop_at_tract * object.pct
#                 total += pop_at_tract * object.pct
#
#         print(total)
#
#         return Response(wards)
#
# @api_view(['GET'])
# def population_list_domain(request, domain):
#     if request.method == 'GET':
#         print("domain:")
#         print(domain)
#         print("date:")
#         print(slug)
#         return Response(domain)
#
#
# @api_view(['GET'])
# def tract_list(request):
#     queryset = Tract.objects.all()
#     serializer = TractGeoSerializer(queryset, many=True)
#     return JsonResponse(serializer.data, safe=False)
#
# @api_view(['GET'])
# def zip_list(request):
#     queryset = Zip.objects.all()
#     serializer = ZipGeoSerializer(queryset, many=True)
#     return JsonResponse(serializer.data, safe=False)
#
# @api_view(['GET'])
# def neighborhood_list(request):
#     queryset = Neighborhood.objects.all()
#     serializer = NeighborGeoSerializer(queryset, many=True)
#     return JsonResponse(serializer.data, safe=False)
#
# @api_view(['GET'])
# def precinct_list(request):
#     queryset = Precinct.objects.all()
#     serializer = PrecinctGeoSerializer(queryset, many=True)
#     return JsonResponse(serializer.data, safe=False)
#
# @api_view(['GET'])
# def ward_list(request):
#     queryset = Ward.objects.all()
#     serializer = WardGeoSerializer(queryset, many=True)
#     return JsonResponse(serializer.data, safe=False)