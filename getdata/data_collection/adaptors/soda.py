import os
from sodapy import Socrata
from chi77.settings import SODA_APP_TOKEN, SODA_SECRET_TOKEN, BASE_DIR

from .base import Adaptor as BaseAdaptor
from ...helpers.data import get_nested, extract_kml_placemarks

from fastkml import kml

# supported SODA resources
RESOURCES = {
    'chicagocity': "data.cityofchicago.org"
}

# supported categories of data for each resource
SODA_TYPE_API = 'API'
SODA_TYPE_KML = 'KML'

CATEGORIES = {
    'chicagocity': {
        'cta': {
            'bus-routes': {
                'type': SODA_TYPE_API,
                'uid': 'bynn-gwxy'
            },
            'train-stations': {
                'type': SODA_TYPE_API,
                'uid': '8pix-ypme'
            },
            'train-lines': {
                'type': SODA_TYPE_KML,
                'uid': 'CTA_RailLines'
            }
        }
    }
}

class Adaptor(BaseAdaptor):
    
    def __init__(self):
        super().__init__()
        """
        SODA API URL
        """
        self._soda_resource = None

    def set_resources(self, resources):
        super().set_resources(resources)
        self._soda_alias = self._resources[0]
        self._soda_resource = RESOURCES[self._soda_alias]

        self._client = Socrata(self._soda_resource, None)
        self._kml_base_dir = os.path.join(BASE_DIR, 'getdata', 'data', 'soda', 'kml')
        self._kml_reader = kml.KML()

    def extract(self, category, query):
        """
        See parent
        """
        # TODO: Query parser does not work for SODA yet !
        resource_meta = get_nested(CATEGORIES, '%s.%s' % (self._soda_alias, category))
        if resource_meta['type'] == SODA_TYPE_API:
            return self._client.get(resource_meta['uid'])
        elif resource_meta['type'] == SODA_TYPE_KML:
            with open(os.path.join(self._kml_base_dir, resource_meta['uid'] + '.kml'), 'rb') as f:
                doc = f.read()
            self._kml_reader.from_string(doc)
            return extract_kml_placemarks(self._kml_reader, True)

    def transform(self, extracted_data):
        """
        See parent
        """
        self.data = extracted_data
    
    def load(self):
        """
        See parent
        """
        return self.data
