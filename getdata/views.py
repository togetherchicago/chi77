from rest_framework.response import Response
from rest_framework.decorators import api_view
from chicagomap.models import Tract, Precinct, Zip, Ward, Neighborhood
import ast

from .models import Population
from .serializers import *


from rest_framework import viewsets
from django.http import JsonResponse
from django.core.serializers import serialize
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
        serializer = PopulationSerializer(Population.objects.all(), many=True)
        return Response(serializer.data)

    elif request.method == 'POST':

        if request.data:

            body = request.data
            tracts = wards = precincts = neighborhoods = zips = []

            if 'tracts' in body.keys():
                tracts = ast.literal_eval(body['tracts'])
            if 'wards' in body.keys():
                wards = ast.literal_eval(body['wards'])
            if 'precincts' in body.keys():
                precincts = ast.literal_eval(body['precincts'])
            if 'neighborhoods' in body.keys():
                neighborhoods = ast.literal_eval(body['neighborhoods'])
            if 'zips' in body.keys():
                zips = ast.literal_eval(body['zips'])

            if tracts and not (wards or precincts or neighborhoods or zips):
                serializer = PopulationSerializer(Population.objects.filter(census_tract__name10__in=tracts), many=True)
                return Response(serializer.data)

            # figure out how to get equivalencies

        serializer = PopulationSerializer(Population.objects.all(), many=True)
        return Response(serializer.data)

#/api/domains
# GET request returns a list of available domains
@api_view(['GET'])
def domain_list(request, format=None):
    """
        get: returns a list of available domains
    """
    content =  [
        {
        "title": "GeoJSON: Census Tracts",
        "description": "Fetch GeoJSON objects of all tracts",
        "method": "GET",
        "domain": "/api/domain/tracts"
        },
        {
        "title": "GeoJSON: Wards",
        "description": "Fetch GEOJSON objects of all wards",
        "method": "GET",
        "domain": "/api/domain/wards"
        },
        {
        "title": "GeoJSON: Neighborhoods",
        "description": "Fetch GEOJSON objects of all neighborhoods",
        "method": "GET",
        "domain": "/api/domain/neighborhoods"
        },
        {
        "title": "GeoJSON: Precincts",
        "description": "Fetch GEOJSON objects of all precincts",
        "method": "GET",
        "domain": "/api/domain/precincts"
        },
        {
        "title": "GeoJSON: Zip Codes",
        "description": "Fetch GEOJSON objects of all zip codes",
        "method": "GET",
        "domain": "/api/domain/zipcodes"
        }
    ]
    return Response(content)
    
@api_view(['GET'])
def tract_list(request):
    queryset = Tract.objects.all()
    serializer = TractGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def zip_list(request):
    queryset = Zip.objects.all()
    serializer = ZipGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def neighborhood_list(request):
    queryset = Neighborhood.objects.all()
    serializer = NeighborGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def precinct_list(request):
    queryset = Precinct.objects.all()
    serializer = PrecinctGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)

@api_view(['GET'])
def ward_list(request):
    queryset = Ward.objects.all()
    serializer = WardGeoSerializer(queryset, many=True)
    return JsonResponse(serializer.data, safe=False)