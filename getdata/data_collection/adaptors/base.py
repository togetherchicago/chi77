from ..exceptions import QueryNotValidException
from ..constants import *

class Adaptor(object):
    """
    Abstract base class for data retrieval
    """
    
    def set_resource(self, resources):
        """
        Set the sub resourse for some data types if necessary
        
        Arguments:
            resource {list} -- Resource as a list, contains up to arbitrary depth of data resources
        
        Returns:
            Adaptor
        """
        self._resources = resources
    
    def extract(self, category, query):
        """
        Extract takes data from requests and query from query parser
        
        Arguments:
            category {str} -- data category
            query {dict} -- query parsed from frontend
        """
        pass

    def transfer(self, extracted_data):
        """
        Tranfer extracted data from extraction process to another medium
        
        Arguments:
            extracted_data {mixed} -- Extracted data
        """
        pass
    
    def load(self):
        """
        Load and return the extracted data that are saved after the transfer process
        """
        return None

    def parse_query(self, category, query):
        """
        Simple query parser that converts user input to actual API call input
        
        Arguments:
            query {dict} -- Original query
        Returns:
            tuple -- depending on actual adaptor
        """
        return None

class QueryLoader(object):
    """
    Abstract base class for Query loaders
    """

    def check(self, query):
        """
        Check the general validity of query.
        Note that it does not check resource specific query types
        
        Arguments:
            query {dict}
        """
        for operator, subqueries in query.items():
            if operator not in VALID_QUERY_OPERATORS:
                raise QueryNotValidException("Query operator is not valid")
            # TODO more query operator specific checks

    def process_query(self, query):
        """
        Load raw query from request
        
        Arguments:
            query {dict}
        """
        self.check(query)
        self.apply_query(query)

    def get_results(self):
        """
        Get the final query results
        Should be overridden
        """
        pass

    def apply_query(self, query):
        """
        Dissect the query and apply each operation
        """
        for operator, subqueries in query.items():
            if operator == QUERY_SELECT:
                self.apply_select(subqueries)
            elif operator == QUERY_ORDER_BY:
                self.apply_order_by(*subqueries)
            elif operator == QUERY_LIMIT:
                self.apply_limit(*subqueries)
            elif operator == QUERY_OFFSET:
                self.apply_offset(*subqueries)
            elif operator == QUERY_WHERE:
                self.apply_where(*subqueries)
        

    def apply_select(self, columns):
        """
        Apply a select operation on certain columns
        Should be overridden

        Arguments:
            columns {list}
        """
        pass

    def apply_where_results(self, data):
        """
        Retrieve the final result with multple where operators as a final
        step of the where statements
        Should be overriden

        Arguments:
            data {mixed}
        """
        pass

    def apply_where(self, column, operator, value):
        """
        Apply a where operation to the data
        Should be overridden
        
        Arguments:
            column {str} -- Data column to filter on
            operator {str} -- > < =
            value {str} -- Value to filter against
        
        Returns:
            {mixed} -- filtered data
        """
        # TODO
        pass
    
    def apply_order_by(self, columnm, order):
        """
        Apply a order by operator for the data
        Should be overridden

        Arguments:
            columnm {str} -- Data column to sort on
            order {str} -- asc or desc
        """
        # TODO
        pass
    
    def apply_limit(self, value):
        """
        Apply a limit operation to the data
        Should be overridden

        Arguments:
            value {int} -- number of data items to limit on 
        """
        # TODO
        pass

    def apply_offset(self, offset):
        """
        Apply a paging/offset operation to the data
        Should be overridden

        Arguments:
            offset {int} -- number of items to skip 
        """
        # TODO
        pass


    

        
        
