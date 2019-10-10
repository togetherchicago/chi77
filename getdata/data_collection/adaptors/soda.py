from sodapy import Socrata
from chi77.settings import SODA_APP_TOKEN, SODA_SECRET_TOKEN

from .base import Adaptor as BaseAdaptor
from ...helpers.data import get_nested

# supported SODA resources
RESOURCES = {
    'chicagocity': "data.cityofchicago.org"
}

# supported categories of data for each resource
CATEGORIES = {
    'chicagocity': {
        'cta': {
            'bus-routes': 'bynn-gwxy',
            'train-stations': '8pix-ypme'
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

    def extract(self, category, query):
        """
        See parent
        """
        # TODO: Query parser does not work for SODA yet !
        uid = get_nested(CATEGORIES, '%s.%s' % (self._soda_alias, category))
        return self._client.get(uid)

    def transform(self, extracted_data):
        """
        See parent
        """
        self.data= extracted_data
    
    def load(self):
        """
        See parent
        """
        return self.data
