# Local Docker Compose setup

This Compose configuration is for local development of ProcessMaker 4.14.0. It runs PHP 8.3-FPM, Nginx, MySQL 8, Redis, Laravel Horizon, the Laravel scheduler, and Laravel Echo Server. It is not a production deployment.

## Start services

From the repository root:

```shell
docker compose build
docker compose up -d mysql redis
docker compose run --rm app composer install
docker compose run --rm frontend
```

For a new, empty installation, first back up the existing `.env` and database. The installer refuses to run when `.env` exists and replaces database tables during a fresh install. Only after confirming this is a fresh setup, move the existing `.env` out of the project root (PowerShell example: `Move-Item .env .env.backup`), then run:

```shell
docker compose run --rm -e SKIP_EXECUTORS=true app php artisan processmaker:install --url=http://localhost:8080 --db-host=mysql --db-port=3306 --db-name=processmaker --db-username=processmaker --db-password=processmaker-local
docker compose up -d
```

The installer will prompt for the administrator details. When it completes, open <http://localhost:8080>. The Compose database defaults are for local development only; change them with `COMPOSE_MYSQL_DATABASE`, `COMPOSE_MYSQL_USER`, `COMPOSE_MYSQL_PASSWORD`, and `COMPOSE_MYSQL_ROOT_PASSWORD` before starting the stack if needed. If you change these values after MySQL has initialized its named volume, update or recreate that database volume only after backing up any data.

If ProcessMaker is already installed, do not run the installer. By default, Compose uses its own MySQL container and database volume; it does not automatically connect to or import the database configured in your existing `.env`. Back up and import the database into the Compose MySQL service, or deliberately change the Compose database settings to reach your existing database before starting the app.

## Rebuild frontend assets

After changing frontend source, run `docker compose run --rm frontend` again. The command uses `npm ci` and then Laravel Mix's development build.

## Notes

- The installer skips Docker script-executor installation by default (`SKIP_EXECUTORS=true`). ProcessMaker's PHP container does not have access to the host Docker daemon, so BPMN script execution requiring those executors is unavailable. Enabling executors requires a Docker daemon connection and should be configured deliberately; mounting the Docker socket grants the container control over the host Docker daemon.
- The local Compose app disables HTTPS forcing and Telescope, and uses `SESSION_DOMAIN=localhost` for HTTP login cookies. If you change the development host, set `COMPOSE_SESSION_DOMAIN` to the hostname only (no scheme or port) and set `COMPOSE_APP_URL` to the full HTTP URL.
- The default MySQL credentials, HTTP endpoint, and Echo key are local-development values. Do not use them for a public or production deployment.
- To stop the containers, run `docker compose down`. This preserves the MySQL volume. `docker compose down -v` deletes the database volume and all data stored in it.
