#!/bin/bash
echo -e "Migrating..."
python3 manage.py makemigrations
python3 manage.py migrate
echo -e "Done migrating!"
echo -e "Loading data..."
echo -e "from chicagomap.load import run\nrun()" | python3 manage.py shell
echo -e "Done loading data!"
echo -e "Generating equivalencies..."
python3 manage.py generate_equivalencies
echo -e "Done generating equivalencies!"
python3 manage.py populate_db

