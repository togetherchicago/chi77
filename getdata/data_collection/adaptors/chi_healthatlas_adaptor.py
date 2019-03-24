from .base import Adaptor as BaseAdaptor
import requests

class Chi_HealthAtlas_Adaptor(BaseAdaptor):
    
    def __init__(self):
        super().__init__()
        self._base_url = "https://api.chicagohealthatlas.org/api/v1"
    
    def extract(self, category, query):
        """
        See parent
        """
        api_url = self.parse_query(category, query)
        return requests.get(api_url)
        

    def transfer(self, extracted_data):
        """
        See parent
        """
        self.data = extracted_data.json()
    
    def load(self):
        """
        See parent
        """
        return self.data
    
    def parse_query(self, category, query):
        """
        See parent
        """
        # api url
        api_url = "%s/%s" % (self._base_url, category)

        # extract params
        geo_slug, area_slug, indicator_slug = query.get('geo_slug', ""), \
                                              query.get('area_slug', ""), \
                                              query.get('indicator_slug', "")

        # TODO: this needs to be updated, currently only dealing with the Curtis's toy app frontend
        if category == 'topic_info':
            api_url = "%s/%s/%s" % (api_url, geo_slug, indicator_slug)
        elif category == 'place':
            api_url = "%s/%s" % (api_url, geo_slug)
        elif category == 'race':
            api_url = "%s/%s" % (api_url, area_slug)

        return api_url
            
        
