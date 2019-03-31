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
        # TODO
        return True

    def load_raw_query(self, query):
        """
        Load raw query from request
        
        Arguments:
            query {dict}
        """
        self.check(query)
        self._query = query
    
    def set_data(self, data):
        """
        Update the data to be applied by each query operation
        E.g. the client can use this method to dynamically apply the query
        on either the API url or the actual data
        
        Arguments:
            data {mixed}
        """
        self._data = data
    
    def apply_query(self):
        """
        Dissect the query and apply each operation
        """
        pass

    def apply_where(self, column, operator, value):
        """
        Apply a where operation to the data
        Should be overridden
        
        Arguments:
            column {str} -- Data column to filter on
            operator {str} -- > < ===
            value {str} -- Value to filter against
        """
        # TODO
        pass
    
    def apply_union(self, data1, data2):
        """
        Apply a set union operator for two sides of data
        Can be overridden

        Arguments:
            data1 {Iterable}
            data2 {Iterable}
        """
        # TODO
        pass
    
    def apply_intersection(self, data1, data2):
        """
        Apply a set union operator for two sides of data
        Can be overridden

        Arguments:
            data1 {Iterable}
            data2 {Iterable}
        """
        # TODO
        pass
    
    def apply_order_by(self, columnm, order):
        """
        Apply a order by operator for the data
        Can be overridden

        Arguments:
            columnm {str} -- Data column to sort on
            order {str} -- asc or desc
        """
        # TODO
        pass
    
    def apply_limit(self, value):
        """
        Apply a limit operation to the data
        Can be overridden

        Arguments:
            value {int} -- number of data items to limit on 
        """
        # TODO
        pass

    def apply_offset(self, offset):
        """
        Apply a paging/offset operation to the data
        Can be overridden

        Arguments:
            offset {int} -- number of items to skip 
        """
        # TODO
        pass


    

        
        
