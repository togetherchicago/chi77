# chi77
Together Chicago's data analytics platform
## Instructions for setting up development environment
1. Ensure Docker >=17 is installed on your system. See https://docs.docker.com/install/ for more detailed instructions.
2. Clone the repository to your local machine: 
    git clone https://github.com/mozebdi/chi77.git ./chi77
3. Run the docker-compose command in the chi77 directory: ```docker-compose up```
4. Access the server at localhost:8000.
5. To use the Django admin console, access localhost:8000/admin/.
6. To kill the server, just press CTRL-C in the docker-compose terminal window.
7. To connect the Docker Python interpreter to PyCharm Professional Edition, follow the instructions under "Configuring Pycharm" on this page: https://blog.jetbrains.com/pycharm/2017/03/docker-compose-getting-flask-up-and-running/
8. To run bash commands in a container, just use docker ps to see container names, then run the following command to connect to the container:
```
    docker exec -it container_name bash
``` 
9. To clean up the containers and all their corresponding volumes, run this command in the chi77 directory:
```
    docker-compose down -v
```
*NOTE*: This is not a production-safe config as-is! Change the SECRET\_KEY in settings.py as well as the POSTGRES\_USER and POSTGRES\_PASSWORD values in the docker-compose.yaml and settings.py files for a prod environment.
