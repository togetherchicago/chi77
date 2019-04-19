from sodapy import Socrata
from chi77.settings import SODA_APP_TOKEN, SODA_SECRET_TOKEN

from .base import Adaptor as BaseAdaptor

class Adaptor(BaseAdaptor):
    
    def __init__(self):
        super().__init__()

        """
        Params:
        - category: in SODA, category is the literal form of the dataset UID we are fetching,
                    e.g. "Public-Health-Statistics-Selected-public-health-in" to "iqnk-2tcu"
        """
        self._category = None
    
    def extract(self, category, query):
        """
        See parent
        """
        self._category = category

    def transform(self, extracted_data):
        """
        See parent
        """
        pass
    
    def load(self):
        """
        See parent
        """
        return None
