from .adaptors import *

class Pipeline(object):
    
    def __init__(self, section):
        self._section = section

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
                'soda': SODA_API
            },
            'transite': {
                'soda': SODA_API
            }
        }

    def fetch(self, resource, category, query):
        """
        Arguments:
            category {str} -- category one of healthcare/transit
            query {dict} -- parsed query data
        """
        api = self.resources()[self._section][resource]
        api.transfer(api.extract(category, query))
        return api.load()
        
