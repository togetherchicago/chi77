import os
from django.contrib.gis.utils import LayerMapping
from chicagomap.models import Tract, Neighborhood, Zip, Precinct, Ward

neighborhood_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'neighborhoods.geojson'),
)

# Auto-generated `LayerMapping` dictionary for Neighborhood model
neighborhood_mapping = {
    'shape_area': 'shape_area',
    'pri_neigh': 'pri_neigh',
    'sec_neigh': 'sec_neigh',
    'shape_len': 'shape_len',
    'geom': 'MULTIPOLYGON',
}

ward_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'wards.geojson'),
)

# Auto-generated `LayerMapping` dictionary for Ward model
ward_mapping = {
    'ward': 'ward',
    'shape_area': 'shape_area',
    'shape_leng': 'shape_leng',
    'geom': 'MULTIPOLYGON',
}

zip_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'zipcodes.geojson'),
)

zip_mapping = {
    'objectid': 'objectid',
    'shape_len': 'shape_len',
    'zip': 'zip',
    'shape_area': 'shape_area',
    'geom': 'MULTIPOLYGON',
}

precinct_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'precincts.geojson'),
)

precinct_mapping = {
    'shape_area': 'shape_area',
    'precinct': 'precinct',
    'ward': 'ward',
    'full_text': 'full_text',
    'shape_len': 'shape_len',
    'geom': 'MULTIPOLYGON',
}

tract_geojson = os.path.abspath(
    os.path.join(os.path.dirname(__file__), 'data', 'censustracts.geojson'),
)

tract_mapping = {
    'statefp10': 'statefp10',
    'name10': 'name10',
    'commarea_n': 'commarea_n',
    'namelsad10': 'namelsad10',
    'commarea': 'commarea',
    'geoid10': 'geoid10',
    'notes': 'notes',
    'tractce10': 'tractce10',
    'countyfp10': 'countyfp10',
    'geom': 'MULTIPOLYGON',
}


def run(verbose=True):
    Tract.objects.all().delete()
    Neighborhood.objects.all().delete()
    Zip.objects.all().delete()
    Precinct.objects.all().delete()
    Ward.objects.all().delete()
    lm_neighborhood = LayerMapping(Neighborhood, neighborhood_geojson, neighborhood_mapping, transform=False)
    lm_ward = LayerMapping(Ward, ward_geojson, ward_mapping, transform=False)
    lm_zip = LayerMapping(Zip, zip_geojson, zip_mapping, transform=False)
    lm_precinct = LayerMapping(Precinct, precinct_geojson, precinct_mapping, transform=False)
    lm_tract = LayerMapping(Tract, tract_geojson, tract_mapping, transform=False)
    lm_neighborhood.save(strict=True, verbose=verbose)
    lm_ward.save(strict=True, verbose=verbose)
    lm_zip.save(strict=True, verbose=verbose)
    lm_precinct.save(strict=True, verbose=verbose)
    lm_tract.save(strict=True, verbose=verbose)
