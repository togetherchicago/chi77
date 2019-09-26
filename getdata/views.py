from rest_framework.response import Response
from rest_framework.decorators import api_view
import ast

from getdata.serializers import *
from getdata.models import Domain, Equivalency, Indicator, Statistic
from rest_framework import viewsets

from django.http import Http404
from django.http import JsonResponse
from django.core.serializers import serialize
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import F, Count, Value
from django.db.models.fields import IntegerField, DecimalField

import time
import json
import datetime

content = [
    {
        "title": "Census Tract",
        "description": "Fetch GeoJSON objects of all tracts",
        "method": "GET",
        "domain": "/api/domain/tracts"
    },
    {
        "title": "Ward",
        "description": "Fetch GEOJSON objects of all wards",
        "method": "GET",
        "domain": "/api/domain/wards"
    },
    {
        "title": "Neighborhood",
        "description": "Fetch GEOJSON objects of all neighborhoods",
        "method": "GET",
        "domain": "/api/domain/neighborhoods"
    },
    {
        "title": "Precinct",
        "description": "Fetch GEOJSON objects of all precincts",
        "method": "GET",
        "domain": "/api/domain/precincts"
    },
    {
        "title": "ZIP Code",
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


def convert_domainv2(indicator, b_domain): 
    
    rank = {
        "Precinct": 5, 
        "Census Tract": 4, 
        "Neighborhood": 1, 
        "ZIP Code": 2, 
        "Ward": 3
    }

    to_domain = {}
    domains = Domain.objects.filter(domain_name=b_domain).values('name')
    for domain in domains: 
        to_domain[domain['name']] = 0.0

    from_stats = {}
    stats = Statistic.objects.filter(indicator=indicator).values('value', 'domain__name')
    for stat in stats: 
        from_stats[stat['domain__name']] = float(stat['value'])

    total = 0.0
    # determine A -> B or B- > A
    if rank[indicator.domain_name] < rank[b_domain]: 
    
        eqs = Equivalency.objects.filter(geom_a__domain_name=indicator.domain_name, geom_b__domain_name=b_domain).values('pct_a', 'geom_a__name', 'geom_b__name')
        for eq in eqs: 
            if eq['geom_a__name'] in from_stats.keys(): 
                total += eq['pct_a'] * from_stats[eq['geom_a__name']]
                to_domain[eq['geom_b__name']] += eq['pct_a'] * from_stats[eq['geom_a__name']]
    
    else: 

        eqs = Equivalency.objects.filter(geom_a__domain_name=b_domain, geom_b__domain_name=indicator.domain_name).values('pct_b', 'geom_a__name', 'geom_b__name')
        for eq in eqs: 
            if eq['geom_b__name'] in from_stats.keys(): 
                total += eq['pct_b'] * from_stats[eq['geom_b__name']]
                to_domain[eq['geom_a__name']] += eq['pct_b'] * from_stats[eq['geom_b__name']]

    return to_domain


@api_view(['GET'])
def dataset_list(request, dataset):
    if request.method == 'GET':

        if dataset == "domains":
            return Response(content)

        try: 
            indicator_id = Indicator.objects.get(name=dataset)
            stats = Statistic.objects.filter(indicator=indicator_id).values('domain__name', 'value')
            to_domain = {}
            for stat in stats: 
                to_domain[stat['domain__name']] = stat['value']
            return Response(to_domain)

        except ObjectDoesNotExist: 
            raise Http404


@api_view(['GET'])
def dataset_list_domain(request, dataset, domain):
    if request.method == 'GET':

        if dataset == "domains": 
            return Response(content)

        try: 
            indicator_id = Indicator.objects.get(name=dataset)
            if indicator_id.domain_name != domain: 
                res = convert_domainv2(indicator_id, domain)
            else: 
                stats = Statistic.objects.filter(indicator=indicator_id).values('domain__name', 'value')
                to_domain = {}
                for stat in stats: 
                    to_domain[stat['domain__name']] = stat['value']
                return Response(to_domain)
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
