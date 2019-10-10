class QueryNotValidException(Exception):
    """
    Indicates that a query is malformed
    
    Arguments:
        Exception {[type]} -- Exception class
    """
    pass

class APIRequestFailureException(Exception):
    """
    Indicates that a request to external API has failed
    
    Arguments:
        Exception {[type]} -- Exception class
    """
    pass
