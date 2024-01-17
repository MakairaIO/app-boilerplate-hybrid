# Makaira App Boilerplate / Starterkit

[Symfony 6.1.2](https://symfony.com/) webapp as a starting point for creating makaira applications.
Contains custom authenticator for authorizing requests based on an HMAC as query parameter, as well as some basic makaira-like styling.


## Requirements

- PHP 8+
- Composer 2+
- [Symfony CLI](https://symfony.com/download)

## Local Setup

1. Run `composer install`

### Local Development

1. Run `symfony server:start --port=8000`
2. To start the local server with https, use ngrok: `ngrok http 8000`
3. Run `npm install` to install packages for nextjs
4. Run `npm run dev` to start develope with Frontend

### Use database for multi-tenant

1. Update docker-compose database local username/passwor and name of database
2. Update .env.local file database connection string (copy from .env file)
3. Run ```docker-compose up -d```
4. Access to docker container with command ```docker exec -it <container-name> bash
5. Login Mysql with command: ```mysql -u <username> <database> -p<password>
6. Run below command to add local test tenant: 
```
insert into app_info(makaira_domain, makaira_instance, app_slug, app_secret, app_config) value("demo.makaira.io", "storefront", "app-boilerplate", "e8d4e7defffc2055ab5646b0ad724960", NULL);
```
7. Start Local development
8. You can access with url: http://localhost:8000/?hmac=a6cb894d51b1d33bf8376d2d9455436ec9739acaa79ccf94c720decd9c47c217&nonce=123456&domain=demo.makaira.io&instance=storefront

### Development Note
- In local development, all `/api/*` request will be re-write the origin via `LOCAL_API_URL=http://localhost:8000` env
- All api handled by symfony server <strong>MUST</strong> be under ``/api`` path. The remaining request will be handled by nextjs
- For more information, please take a look at ``Procfile`` and ``nginx_app.conf`` file to know how the requests handling


#### For App serve only for 1 client 1 instance
 - we support wrap page ``getServerSideProps`` with ``withMakaira`` . It will read Environment then generate HMAC token instead of call query to php server
- When you provide 1 of below env, the app will become single TENANT
   ```
   MAKAIRA_APP_SECRET_CONTENT_WIDGET
   MAKAIRA_APP_SECRET_CONTENT_MODAL
   MAKAIRA_APP_SECRET
   ```

   * NOTE: Symfony Authenticator will also skip check auth from DATABASE when one of these 3 ENV existing

- Single Tenant required pair of env to verify auth in Nextjs
  ```
    MAKAIRA_APP_SECRET_CONTENT_WIDGET
    MAKAIRA_APP_SLUG_CONTENT_WIDGET
  ```
  or
  ```
    MAKAIRA_APP_SECRET_CONTENT_MODAL
    MAKAIRA_APP_SLUG_CONTENT_MODAL
  ```
  or
  ```
    MAKAIRA_APP_SECRET
    MAKAIRA_APP_SLUG
  ```
  or you can also provide 3 pair of ENVs to support all appType

## Heroku Setup
1. Open heorku dashboard
2. Navigate to Settings tab
3. In a Buildpacks section, let add 2 build packs in order to support build process for nextjs and symfony:
  ```
  heroku/nodejs
  heroku/php
  ```
4. Add Environment
  ```
  APP_ENV=production
  NODE_ENV=production
  NEXT_PUBLIC_APP_DOMAIN=<domain of the app>
  ```

## Additional Resources
- https://docs.makaira.io/docs/apps
- https://docs.makaira.io/docs/content-widgets
