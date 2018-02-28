# Chi77
Together Chicago's data analytics platform.

## Deployment

Chi77 is a Python Django application communicating with a GIS-enabled Postgres database. It can be run locally on a developer's workstation or on the Heroku cloud.

### Local development environment

To run this software on a development machine, ensure that you have the following tools installed:

1. [Download and install](https://docs.docker.com/install/) the latest version of Docker, then start the Docker agent on your machine (on Macs, a Docker icon will appear in the menubar when the agent is running).
2. [Download and install](https://www.python.org/downloads/) the latest version of Python 3. Using Homebrew on the Mac:
```
$ brew install python3
```
3. Clone this repository to your local filesystem, then navigate into the repo's directory:
```
$ git clone https://github.com/togetherchicago/chi77.git
$ cd chi77/
```

Once these tools are installed you have two options for linking the application server to the database:

#### Option 1: Create a Dockerized server and database

Runs the application server and database in a linked pair of Docker containers. **Pros**: Easy to setup. **Cons**: Takes longer to startup as all analysis data must be downloaded and processed locally before you can use the app.

1. Start the Django application server and Postgres database using Docker Compose:
```
$ docker-compose up
```
2. In a web browser, navigate to the app at `http://localhost:5000`

Note that when running Django inside of Docker, a default Django admin user is automatically created. Log into the Django admin console at `http://localhost:5000/admin` as user `admin` with password `test1234`.

#### Option 2: Run Django natively and connect to the production database

Runs the application server natively (no use of Docker) and attaches to the Heroku-deployed database instance. **Pros**: Starts faster; has access to same datasets that the end user does. **Cons**: More complicated to initially get setup.

Ensure you have installed the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install), then:

1. Install the Geospatial Data Abstraction Library, GDAL. Using Homebrew on the Mac:
```
$ brew install gdal
```
2. Use `pip` to install the application's dependencies:
```
$ pip3 install -r requirements.txt
```
3. Export a `DATABASE_URL` environmental variable that holds the URI of the production database. Alternatively, this variable can be used to connect Django a local database instance, too. For example (the actual production URI cannot by published here, obviously):
```
$ export DATABASE_URL=postgres://username:password@host:port/db_name
```
4. Start the Django server locally:
```
$ heroku local
```
5. In a web browser, navigate to the app at `http://localhost:5000`

If you need to log into the Django admin console you'll need to first create a default user: Execute the `scripts/init_django.sh` script, then log into the console at `http://localhost:5000/admin` as user `admin` with password `test1234`

### Deployment to Heroku

Chi77 will run on the Heroku cloud. Configure your Heroku Dyno as follows:

##### Stack:

* `cedar-14` (App will not run on the default `heroku-16` stack.)

##### Add-ons:

* Heroku Postgres Database

##### Buildpacks:

* `https://github.com/cyberdelia/heroku-geo-buildpack.git`
* `heroku/python`

##### Config Variables:

* `BUILD_WITH_GEO_LIBRARIES` = `1`
* `DATABASE_URL` = (_URI of database_)
