"""
Miscellaenous helpers for data retrieval
"""

def get_nested(dic, key):
    """
    A simple util to get nested dic items using dot notations
    
    Arguments:
        dic {dict}
        key {str}
    
    Returns:
        mixed
    """
    key_list = key.split('.')
    def get_value(data, key):
        curr_key = key[0]
        if curr_key not in data:
            return None
        if type(data[curr_key]) == list:
            curr_key = int(curr_key)
        if len(key) == 1:
            return data[curr_key]
        return get_value(data[curr_key], key[1:])

    return get_value(dic, key_list)
        
