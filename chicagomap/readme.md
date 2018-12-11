# Readme

The chicagomap Django app includes models.py, load.py, and management/commands/generate_equivalencies.py as the primary relevant components.

## models.py
This includes the database models for domains and equivalencies. Domains are the geographic areas on the map (neighborhoods, census tracts, etc.) and equivalencies are mappings from one domain to another.

## load.py
This loads in the geographic data from data/DOMAIN_NAME.geojson where DOMAIN_NAME is one of the five domain types that we've created thus far.

## management/commands/generate_equivalencies.py
This script obviously enough generates equivalency mappings from one domain to another. These are in the form of equivalency objects and are saved in the DB for quick retrieval via the API.