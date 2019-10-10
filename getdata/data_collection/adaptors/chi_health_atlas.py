from .base import Adaptor as BaseAdaptor
from .base import QueryLoader as BaseQueryLoader
from ...helpers.data import get_nested
from ..exceptions import *
from ...helpers.response import *
import requests, operator

BASE_API_URL = "https://api.chicagohealthatlas.org/api/v1"

# these params are used to modify url params
# TODO: this list is not complete yet!
ATTR_CONFIG = {
    "zip_code": {
        "": {
            'tmpl': "/place/${geo_slug}",
            'keys': ['geo_slug'],
            'data_keys': ['zip_codes']
        }
    },
    "community_areas": {
        "": {
            'tmpl': "/place/${geo_slug}",
            'keys': ['geo_slug'],
            'data_keys': ['community_areas']
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
        self._api_url = None
    
    def set_category(self, category):
        super().set_category(category)
        self._url_params_for_category = self._get_url_param(category)
        self._api_url = "%s/%s" % (BASE_API_URL, category)

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
        
        # transform API url
        for query in to_url:
            self._api_url = self.apply_where(
                self._url_params_for_category['tmpl'], *query, True)
        if "${" in  self._api_url:
            raise QueryNotValidException("Some url parameters are missing!")
        self._api_url = BASE_API_URL + self._api_url

        if not self.data:
            self.data = self._retrieve_data()
        
        # query the raw data
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
            return filter(self._where_filter(column, operator, value), data)

    def apply_order_by(self, column, order):
        """
        See parent
        """
        if not self.data:
            self.data = self._retrieve_data()

        self.data = self.data.sort(
                        key=operator.itemgetter(column), 
                        reverse=(order.lower == 'desc'))
    
    def apply_limit(self, value):
        """
        See parent
        """
        if not self.data:
            self.data = self._retrieve_data()

        self.data = self.data[:value]

    def apply_offset(self, offset):
        """
        See parent
        """
        if not self.data:
            self.data = self._retrieve_data()

        if offset >= len(self.data):
            raise QueryNotValidException("$offset size too large")
        self.data = self.data[offset:]

    def _get_url_param(self, category):
        """
        Get the url configurable parts using category
        
        Arguments:
            category {str}
        """
        res = get_nested(ATTR_CONFIG, category)

        if type(res) == dict:
            return res[""] # for the root value
        else:
            return res
        
    def _retrieve_data(self):
        """
        Sends the API request for the data
        """
        res = requests.get(self._api_url)
        if res.status_code != STATUS_OK:
            raise APIRequestFailureException(
                "API call to Chicago Health Atlas failed")
        data = res.json()
        # check for data-keys to extract
        data_keys = self._url_params_for_category.get('date_keys', None)
        if data_keys:
            return {key: data[key] for key in data_keys}
        return data

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
        """
        self.data = extracted_data
    
    def load(self):
        """
        See parent
        """
        return self.data
