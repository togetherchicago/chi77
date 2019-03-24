from .base import Adaptor as BaseAdaptor

class SODA_Adaptor(BaseAdaptor):
    
    def __init__(self):
        super().__init__()
    
    def extract(self, category, query):
        """
        See parent
        """
        pass

    def transfer(self, extracted_data):
        """
        See parent
        """
        pass
    
    def load(self):
        """
        See parent
        """
        return None