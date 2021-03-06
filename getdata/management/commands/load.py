import os
from django.contrib.gis.utils import LayerMapping
from getdata.models import Domain


class CustomLayer(LayerMapping):
    def __init__(self, *args, **kwargs):
        self.custom = kwargs.pop('custom', {})
        super(CustomLayer, self).__init__(*args, **kwargs)

    def feature_kwargs(self, feature):
        kwargs = super(CustomLayer, self).feature_kwargs(feature)
        kwargs.update(self.custom)
        return kwargs


neighborhood_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'neighborhoods.geojson'),
)

# Auto-generated `LayerMapping` dictionary for Neighborhood model
neighborhood_mapping = {
    'name': 'pri_neigh',
    'geom': 'MULTIPOLYGON',
}

ward_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'wards.geojson'),
)

# Auto-generated `LayerMapping` dictionary for Ward model
ward_mapping = {
    'name': 'ward',
    'geom': 'MULTIPOLYGON',
}

zip_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'zipcodes.geojson'),
)

zip_mapping = {
    'name': 'zip',
    'geom': 'MULTIPOLYGON',
}

precinct_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'precincts.geojson'),
)

precinct_mapping = {
    'name': 'full_text',
    'geom': 'MULTIPOLYGON',
}

tract_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'censustracts.geojson'),
)

tract_mapping = {
    'name': 'name10',
    'geom': 'MULTIPOLYGON',
}


def run(verbose=True):
    if len(Domain.objects.all()) > 0:
        print("No domain import necessary.")
        return
    for pair in [[neighborhood_mapping, neighborhood_geojson, 'Neighborhood'], [ward_mapping, ward_geojson, 'Ward'],
                 [zip_mapping, zip_geojson, 'ZIP Code'],
                 [precinct_mapping, precinct_geojson, 'Precinct'], [tract_mapping, tract_geojson, 'Census Tract']]:
        layermapping = CustomLayer(model=Domain, data=pair[1], mapping=pair[0], custom={'domain_name': pair[2]}, transform=False)
        layermapping.save(strict=True, verbose=verbose)
