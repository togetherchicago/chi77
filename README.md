# Chi77
Together Chicago's data analytics platform.

### Running the application

0. (Optional) Create and activate a python virtual environment:
```
$ python3 -m venv env
$ source env/bin/activate
```
1. Use `pip` to install the application's dependencies:
```
$ pip3 install -r requirements.txt
```
2. Use `npm` to install the React application's dependencies in the frontend folder:
```
$ cd frontend
$ npm install
```
3. In one terminal window in the base application folder, run the Django application:
```
$ python3 manage.py runserver 5000
```
This will run the Django server pointing to `http://localhost:5000`.

4. In another terminal window in the frontend folder, run the React application:
```
$ npm start
```

# BELOW IS THE OLD README. It is kept in case some of the information is still helpful.

## Deployment

Chi77 is a Python Django application communicating with a GIS-enabled Postgres database. It can be run locally on a developer's workstation or on the Heroku cloud.

### Local development environment

To run this software on a development machine, ensure that you have the following tools installed:

1. [Download and install](https://docs.docker.com/install/) the latest version of Docker, then start the Docker agent on your machine (on Macs, a Docker icon will appear in the menubar when the agent is running).
2. [Download and install](https://docs.docker.com/compose/install) the latest version of docker-compose, this will allow us to use templates for spinning up multiple docker services at once.
3. [Download and install](https://www.python.org/downloads/) the latest version of Python 3. Using Homebrew on the Mac:
```
$ brew install python3
```
Using Ubuntu/WSL:
```
$ apt-get update && apt-get install python3
```
4. Clone this repository to your local filesystem, then navigate into the repo's directory:
```
$ git clone https://github.com/togetherchicago/chi77.git
$ cd chi77/
```

Once these tools are installed you have two options for linking the application server to the database:

#### Option 1: Create a Dockerized server and database

Runs the application server and database in a linked pair of Docker containers. **Pros**: Easy to setup. **Cons**: Takes longer to startup as all analysis data must be downloaded and processed locally before you can use the app.

1. Install the Geospatial Data Abstraction Library, GDAL.
Using Homebrew on the Mac:
```
$ brew install gdal
```
Using dpkg on Ubuntu/WSL:
```
$ apt-get update && apt-get install gdal-bin
```
Verify installation on Ubuntu with:
```
$ ogrinfo --version
```
2. [Create a new python virtual environment](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)
3. Use `pip` to install the application's dependencies:
```
$ pip3 install -r requirements.txt
```
4. Start the Django application server, React webapp, and Postgres database using Docker Compose:
```
$ docker-compose -f docker-compose.dev.yaml up
```
If you would like to mock the production site locally use `docker-compose.yaml` instead of `docker-compose.dev.yaml`
5. In a web browser, navigate to the app at `http://localhost:3000`

#### Option 2: Run Django natively and connect to the production database (Deprecated)

Runs the application server natively (no use of Docker) and attaches to the Heroku-deployed database instance. **Pros**: Starts faster; has access to same datasets that the end user does. **Cons**: More complicated to initially get setup.

Ensure you have installed the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install), then:

1. Install the Geospatial Data Abstraction Library, GDAL. Using Homebrew on the Mac:
```
$ brew install gdal
```
Using dpkg on Ubuntu/WSL:
```
$ apt-get update && apt-get install gdal-bin
```
Verify installation on Ubuntu with:
```
$ ogrinfo --version
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

### Deployment to Heroku (Deprecated, see wiki for DigitalOcean deployment)

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



##### Helpful hints
These are things that we struggled with while developing, but are stupidly easy to fix.

We recommend you add to this as you uncover new workarounds, so you don't forget them
by the end of the project.


* When I `docker-compose up`, why doesn't my changes in code show up?

    - If you added new frontend dependencies, you need to `docker-compose build`. I recommend also pruning docker
        every now and then, by doing `docker volume prune` and `docker system prune`. This will get rid of a TON
        of memory that Docker is eating up from past containers. After pruning, run `docker-compose build --no-cache`
        for a clean build.

* When I spin up the application and try to apply a filter, nothing happens. Why?

    - We are currently running into a problem with CORS (Cross-Origin Resource Sharing), because we are calling our
        API from localhost:5000, and running the application on localhost:3000. Eventually, you will need to
        look up how to actually fix this problem, but for the time being we used the `Allow-Control-Allow-Origin:`
        Chrome extension plugin to avoid this problem.
* After developing, and using the application on `localhost:3000`, my computer is getting alot of errors when I
    visit other websites, why?

    - You probably didn't turn off your CORS plugin. Make sure that is off, because it messing with most websites.
