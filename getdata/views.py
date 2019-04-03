from django.views.decorators.http import require_http_methods

from .data_collection.pipeline import Pipeline
from .helpers.request import *
from .helpers.response import *


######################
## Helper
######################
def respond_with_data(data_type, resource, category, query):
    try:
        data = Pipeline(date_type).fetch(resource, category, query)
        return respondJSON('success', 'Data is fetched', data)
    except Exception as error:
        #TODO: in the future the exception class can be extended to show different error message to the frontend
        print(error)
        return respondJSON('error', 'Unexpected error happens while fetching data', status_code=STATUS_SERVER_ERROR)

######################
## General API
######################
@require_http_methods(['GET'])
def view_general_data(request):
    resource, category, query = extract_data_request(request)
    return respond_with_data('general', resource, category, query)

#######################
## Transit APIs
#######################
@require_http_methods(['GET'])
def view_transit_data(request):
    resource, category, query = extract_data_request(request)
    return respond_with_data('transit', resource, category, query)

#######################
## Healthcare APIs
#######################
@require_http_methods(['GET'])
def view_healthcare_data(request):
    resource, category, query = extract_data_request(request)
    return respond_with_data('healthcare', resource, category, query)
