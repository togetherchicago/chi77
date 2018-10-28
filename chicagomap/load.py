import os
from django.contrib.gis.utils import LayerMapping
from chicagomap.models import Domain, DomainMeta

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
    for mapping in [neighborhood_mapping, ward_mapping, zip_mapping, precinct_mapping, tract_mapping]:
        layermapping = LayerMapping(Domain, mapping.geom, mapping.name, transform=False)
        layermapping.save(strict=True, verbose=verbose)
