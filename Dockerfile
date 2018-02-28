FROM python:3.6
WORKDIR /django
ADD . /django
RUN apt-get update; apt-get --assume-yes install binutils libproj-dev gdal-bin libgdal-dev python-gdal
ENV CPLUS_INCLUDE_PATH=/usr/include/gdal \
    C_INCLUDE_PATH=/usr/include/gdal
RUN pip install GDAL==$(gdal-config --version | awk -F'[.]' '{print $1"."$2}')
RUN pip install --trusted-host pypi.python.org -r requirements.txt
ENV NAME Chi77-Django
