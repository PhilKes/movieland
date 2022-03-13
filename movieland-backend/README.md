# movieland-backend

## Build Setup
Make sure a Postgres database is running on `localhost:5432` with:
* A database called `movieland_db`
* root user called `movielandadmin` pw: `movielandadmin`
```bash
# build for production and launch server
mvn clean package
java -jar target/movieland-spring-0.0.1-SNAPSHOT.jar 
```