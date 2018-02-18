#!/bin/bash
sleep 15
echo -e "Migrating..."
python manage.py migrate
echo -e "Done migrating!"
echo -e "Loading data..."
echo -e "from chicagomap.load import run\nrun()" | python manage.py shell
echo -e "Done loading data!"
echo -e "Generating equivalencies..."
python manage.py generate_equivalencies
echo -e "Done generating equivalencies!"
echo -e "Launching server..."
python manage.py runserver 0.0.0.0:8000
echo -e "Server killed."
