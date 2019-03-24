from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

from .data_collection.pipeline import Pipeline
from .helpers import request as requestHelper

######################
## General API
######################
@require_http_methods(['GET'])
def view_general_data(request):
    resource, category, query = requestHelper.extract_data_request(request)
    return JsonResponse(Pipeline('general').fetch(resource, category, query), safe=False)

#######################
## Transit APIs
#######################
@require_http_methods(['GET'])
def view_transit_data(request):
    resource, category, query = requestHelper.extract_data_request(request)
    return JsonResponse(Pipeline('transit').fetch(resource, category, query), safe=False)

#######################
## Healthcare APIs
#######################
@require_http_methods(['GET'])
def view_healthcare_data(request):
    resource, category, query = requestHelper.extract_data_request(request)
    return JsonResponse(Pipeline('healthcare').fetch(resource, category, query), safe=False)