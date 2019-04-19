from .base import Adaptor as BaseAdaptor
from .base import QueryLoader as BaseQueryLoader
from ...helpers.data import get_nested
from ..exceptions import *
from ...helpers.response import *
import requests

BASE_API_URL = "https://api.chicagohealthatlas.org/api/v1"
# these params are used to modify url params
# TODO: this list is not complete yet!
URL_PARAMS = {
    "place": {
        "": {
            'tmpl': "/place/${geo_slug}",
                    'keys': ['geo_slug']
        }
    },
    "race": {
        "": {
            'tmpl': "/race/${area_slug}",
                    'keys': ['area_slug']
        }
    },
    "topic_info": {
        "": {
            'tmpl': "/topic_info/${geo_slug}/${indicator_slug}",
                    'keys': ['geo_slug', 'indicator_slug']
        }
    }
}

class QueryLoader(BaseQueryLoader):
    
    def __init__(self):
        self._api_url = BASE_API_URL
    
    def set_category(self, category):
        super().set_category(category)
        self._update_url_params_from_category(category)

    def apply_where_aggregated(self, subqueries):
        """
        See parent
        """
        to_url, to_data = [], []
        for query in subqueries:
            if self._url_params_for_category and \
                query[0] in self._url_params_for_category['keys']:
                to_url.append(query)
            else:
                to_data.append(query)
        for query in to_url:
            self._api_url = self.apply_where(
                self._url_params_for_category['tmpl'], *query, True)
        if not self.data:
            res = requests.get(self._api_url)
            if res.status_code != STATUS_OK:
                raise APIRequestFailureException("API call to Chicago Health Atlas failed")
        for query in to_data:
            self.data = self.apply_where(self.data, *query)

    def apply_where(self, data, column, operator, value, is_url = False):
        """
        See parent
        """
        if is_url:
            if operator != '=':
                raise QueryNotValidException("Operator for $where not supported")
            return data.replace("${%s}" % column, value)
        else:
            # TODO
            return []


    def _update_url_params_from_category(self, category):
        """
        Get the url configurable parts using category
        
        Arguments:
            category {str}
        """
        res = get_nested(URL_PARAMS, category)

        if type(res) == dict:
            self._url_params_for_category = res[""] # for the root value
        else:
            self._url_params_for_category = res


class Adaptor(BaseAdaptor):
    
    def __init__(self):
        super().__init__()
        self._query_loader = QueryLoader()
        
    def extract(self, category, query):
        """
        See parent
        """
        self._query_loader.set_category(category)
        self._query_loader.process_query(query)
        return self._query_loader.get_data()

    def transform(self, extracted_data):
        """
        See parent

        In this case can't see any case for transformation 
        """
        self.data = extracted_data
    
    def load(self):
        """
        See parent
        """
        return self.data
    
    def parse_query(self, category, query):
        """
        See parent
        @deprecated
        """
        # api url
        api_url = "%s/%s" % (BASE_API_URL, category)

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
            
        
