from .adaptors import *

class Pipeline(object):
    
    def __init__(self, data_type):
        """
        Params:
        - data_type: topmost level of data we are fetching
        """
        self._data_type = data_type

    def resources(self):
        """
        List of API resources adaptors backend can use
        Note: add created data adaptors here
        """
        return {
            'general': {
                'chi_health_atlas': CHI_HEALTHATLAS_API,
            },
            'healthcare': {
                'soda': SODA_API,
            },
            'transit': {
                'soda': SODA_API
            }
        }

    def fetch(self, resource, category, query):
        """
        Arguments:
            category {str} -- category one of healthcare/transit
            query {dict} -- parsed query data
        """
        # resource can use dot notation to access subresource
        resources = resource.split('.')
        adaptor = resources[0]
        
        api = self.resources()[self._data_type][adaptor]
        # bind subresources
        if len(resources) > 1:
            api.set_resources(resources[1:])

        api.transform(api.extract(category, query))
        return api.load()
        
