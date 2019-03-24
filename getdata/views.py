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
    return JsonResponse(Pipeline().fetch('general', resource, category, query), safe=False)

#######################
## Transit APIs
#######################
@require_http_methods(['GET'])
def view_transit_data(request):
    resource, category, query = requestHelper.extract_data_request(request)
    return JsonResponse(Pipeline().fetch('transit', resource, category, query), safe=False)

#######################
## Healthcare APIs
#######################
@require_http_methods(['GET'])
def view_healthcare_data(request):
    resource, category, query = requestHelper.extract_data_request(request)
    return JsonResponse(Pipeline().fetch('healthcare', resource, category, query), safe=False)