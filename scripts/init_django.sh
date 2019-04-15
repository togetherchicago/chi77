#!/bin/bash
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py generate_equivalencies
python3 manage.py createsuperuser
python3 manage.py runserver 0.0.0.0:5000
