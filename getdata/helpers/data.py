"""
Miscellaenous helpers for data retrieval
"""
from fastkml.kml import Placemark

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

def extract_kml_placemarks(k):
    """
    Extract all placemarks from kml and return in a flattened list
    
    Arguments:
        k {fastkml.KML} -- kml reader doc
    """
    def extract(node, placemarks):
        for feature in node.features():
            if type(feature) == Placemark:
                placemarks.append(feature)
            else:
                extract(feature, placemarks)
    
    placemarks = []
    extract(k, placemarks)
    return placemarks
