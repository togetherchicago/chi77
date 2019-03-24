class Adaptor(object):
    """
    Abstract base class for data retrieval
    """
    
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

