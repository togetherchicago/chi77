from ..exceptions import QueryNotValidException
from ..constants import *

class QueryLoader(object):
    """
    Abstract base class for Query loaders
    """

    def __init__(self):
        # data to manipulate/query at runtiome
        self.data = None

    def get_data(self):
        pass
    
    def get_category(self):
        return self.category

    def set_category(self, category):
        self.category = category

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
                
            if operator in [ QUERY_OFFSET, QUERY_LIMIT ]:
                if type(subqueries) != int:
                    raise QueryNotValidException("%s requires a int value" % operator)
            else:
                if type(subqueries) != list:
                    raise QueryNotValidException("%s requires a list value" % operator)
            
            if operator == QUERY_ORDER_BY:
                for subquery in subqueries:
                    if len(subquery) != 2:
                        raise QueryNotValidException("$orderBy requires 2 conditions")
                    if subquery[1].lower() not in ['asc', 'desc']:
                        raise QueryNotValidException("$orderBy requires ASC or DESC")

            if operator == QUERY_WHERE:
                for subquery in subqueries:
                    if type(subquery) != list:
                        raise QueryNotValidException("$where conditions requires a list value")
                    if len(subquery) != 3:
                        raise QueryNotValidException("$where conditions require 3 conditions")
                    if subquery[1] not in ['>', '<', '=']:
                        raise QueryNotValidException("$where condition operator not valid")


    def process_query(self, query):
        """
        Load raw query from request
        
        Arguments:
            query {dict}
        """
        self.check(query)
        self.apply_query(query)

    def sort_query(self, query):
        """
        Reorder the query operations
        
        Arguments:
            query {list}
        """
        operations = []
        # order of proc: where->offset->limit->orderBy->select
        for op in [ QUERY_WHERE, QUERY_OFFSET, QUERY_LIMIT, QUERY_ORDER_BY, QUERY_SELECT ]:
            if op in query:
                operations.append((op, query[op],))
        return operations

    def apply_query(self, query):
        """
        Dissect the query and apply each operation
        """
        # default to process select at last
        for operation, subqueries in query.items():
            if operation == QUERY_SELECT:
                self.apply_select(subqueries)
            elif operation == QUERY_ORDER_BY:
                self.apply_order_by(*subqueries)
            elif operation == QUERY_LIMIT:
                self.apply_limit(*subqueries)
            elif operation == QUERY_OFFSET:
                self.apply_offset(*subqueries)
            elif operation == QUERY_WHERE:
                self.apply_where_aggregated(subqueries)
        

    def apply_select(self, columns):
        """
        Apply a select operation on certain columns
        Should be overridden

        Arguments:
            columns {list}
        """
        pass

    def apply_where_aggregated(self, subqueries):
        """
        Retrieve the final result with multple where operators as a final
        step of the where statements
        Should be overriden

        Arguments:
            subqueries {list}
        """
        for query in subqueries:
            self.data = self.apply_where(self.data, *query)

    def apply_where(self, data, column, operator, value):
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
        return None
    
    def apply_order_by(self, columnm, order):
        """
        Apply a order by operator for the data
        Should be overridden

        Arguments:
            columnm {str} -- Data column to sort on
            order {str} -- asc or desc
        """
        pass
    
    def apply_limit(self, value):
        """
        Apply a limit operation to the data
        Should be overridden

        Arguments:
            value {int} -- number of data items to limit on 
        """
        pass

    def apply_offset(self, offset):
        """
        Apply a paging/offset operation to the data
        Should be overridden

        Arguments:
            offset {int} -- number of items to skip 
        """
        pass

    def _where_filter(self, column, operator, value):
        """
        Create a filter function for where
        
        Arguments:
            item {dict} -- data item
            column {str} -- column to filter
            operator {str} -- operator used to compare
            value {mixed} -- value to compare against
        
        Returns:
            function
        """

        def _filter(item):
            if operator == '=':
                return item[column] == value
            elif operator == '>':
                return item[column] > value
            elif operator == '<':
                return item[column] < value
        return _filter

class Adaptor(object):
    """
    Abstract base class for data retrieval
    """

    def set_resources(self, resources):
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

    def transform(self, extracted_data):
        """
        Transform extracted data from extraction process to another medium
        
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
