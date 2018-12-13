# chi77 Data API 

This is a Django application that defines API methods.

Files: 

management/populate_db.py: This script runs as part of the build process and reads `datasource.csv` to pull in the necessary datasources. 

models.py: Defines models for datasets. See the Database ERD for the entire database schema. 

serializers.py: A collection of functions that serialize Django models so that they can be returned by API endpoints. 

views.py: These functions define the methods for all API routes. For more information, see the API endpoint section. 


API Endpoints: 

Our API routes are templated following this pattern, as defined in urls.py. 

`'api/<str:dataset>/<str:domain>/'`

The dataset variable will find the corresponding indicator and statistics. Then, if specified, will convert that data from the dataset's native domain to the domain passed through the route. For example, we imported population data in terms of Neighborhoods, however, that data should be able to be viewed in different geographic domains, like Census Tract, Precincts, etc. See views.py for how this was implemented. 


