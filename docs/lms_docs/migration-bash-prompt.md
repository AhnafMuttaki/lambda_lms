I added all the migrations files.
I added the docker-compose file and .env to find out the mysql container info and credentials
- analyze all the files to find out the order they should run.
- write a bash file in the root folder to run the migrations. you need to execute the following tasks.

    - find out the order of migrations
    - exec into the mysql container and login to mysql using credentials from .env and docker-compose
    - execute each migration files according to the order it should run 