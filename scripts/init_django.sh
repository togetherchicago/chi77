#!/bin/bash

echo -e "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'test1234')" | python3 manage.py shell
echo -e "Created superuser"                                                                                                                              
