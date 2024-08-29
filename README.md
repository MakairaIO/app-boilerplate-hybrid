# Makaira App Boilerplate / Starterkit

[Symfony 6.1.2](https://symfony.com/) webapp as a starting point for creating makaira applications.
Contains custom authenticator for authorizing requests based on an HMAC as query parameter, as well as some basic makaira-like styling.

## Requirements

- PHP 8+
- Composer 2+
- [Symfony CLI](https://symfony.com/download)
- Nodejs
- Nextjs

## Local Setup

### 1. Required local ENV:
```
  DATABASE_URL=mysql://root:root@127.0.0.1:3306/app-boilerplate?serverVersion=5.7&charset=utf8mb4
  NEXT_PUBLIC_APP_DOMAIN=http://localhost:3000 // use for calling api to FE port
  LOCAL_API_URL=http://localhost:8000  // proxy url to local BE
  NEXT_PUBLIC_DEV_TOKEN=<MAKAIRA BEARER TOKEN> // if you want to fetch data from Makaira Admin
```

### 2. Run `composer install` and `npm ci`

### 3. Run `php bin/console doctrine:migrations:migrate`

### 4. Register App with Makaira local / real
```
  curl --location 'https://<MAKAIRA DOMAIN>/app' \
--header 'X-Makaira-Instance: <MAKAIRA INSTANCE>' \
--header 'Authorization: <MAKAIRA BEARER TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
    "externalURL": "<DOMAIN_TO_YOUR_APP>",
    "slug": "<YOUR_APP_SLUG>",
    "title": {
        "de": "<YOUR APP NAME in GERMAN>",
        "en": "<YOUR APP NAME IN ENGLISH>",
    },
    "icon": {
        "type": "font-awesome",
        "content": "<ICON NAME>"
    },
    "type": "<APP_TYPE>"
}'
```
Description:
  * **MAKAIRA DOMAIN**: domain of Makaira client 
    - example: https://stage.makaira.io
  * **MAKAIRA INSTANCE**: instance of Makaira client
    - example: oxid6
  * **MAKAIRA BEARER TOKEN**: getting from Makaira request's header
    - example: Bearer ....
  * **DOMAIN_TO_YOUR_APP**: your app domain
    - when connect to Makaira local, you can use something like: `http://localhost:3000`
    - when connect to Makaira real, you can use ngrok for link to your local development
    - There are 3 init route base on `APP_TYPE` when register:
    `APP_TYPE=app`  => `DOMAIN_TO_YOUR_APP=http://localhost:3000`
    `APP_TYPE=content-modal`  => `DOMAIN_TO_YOUR_APP=http://localhost:3000/content-modal`
    `APP_TYPE=content-widget`  => `DOMAIN_TO_YOUR_APP=http://localhost:3000/content-widget`
  * **YOUR_APP_SLUG**: identify your app with other app in Makaira instance
  * **APP_TYPE**: There are 3 types of app you need to specific:
    - **app**: Your app will be visible on Makaira Dashboard
    - **content-modal**: Your app will be visible on the Makaira Page Editor fields (have to setup on Component Editor first)
    - **content-widget**: Your app will be visible on Makaira Page Editor (below SEO section)

  Once you get the response from api, you will get **the app's secret**

### 5. APP Tenant
  * If your app serve for only 1 tenant (client):
    Add more ENV as below:
    - if app type = **app**
      ```
        MAKAIRA_APP_SECRET=<YOUR_APP_SECRET_IN_RESPONSE>
        MAKAIRA_APP_SLUG=<YOUR_APP_SLUG>
      ```
    - if app type = **content-modal**
      ```
        MAKAIRA_APP_SECRET_CONTENT_MODAL=<YOUR_APP_SECRET_IN_RESPONSE>
        MAKAIRA_APP_SLUG_CONTENT_MODAL=<YOUR_APP_SLUG>
      ```
    - if app type = **content-widget**
      ```
        MAKAIRA_APP_SECRET_CONTENT_WIDGET=<YOUR_APP_SECRET_IN_RESPONSE>
        MAKAIRA_APP_SLUG_CONTENT_WIDGET=<YOUR_APP_SLUG>
      ```
    or you can also provide 3 pair of ENVs to support all appType

  * If your app serve for multi tenants (clients):
    insert into database table: **app_info**
    ```
    insert into app_info(makaira_domain, makaira_instance, app_slug, app_secret) value("<MAKAIRA DOMAIN>", "<MAKAIRA INSTANCE>", "<YOUR_APP_SLUG>", "<YOUR_APP_SECRET>");
    ```
    
### 6. Start Development

    1. Run `npm run dev` and `npm run dev:server`
    2. If you use ngok for register app, turn on ngork and make sure the url is the same with app domain you registered
    3. Open Makaira (local/real) then access the app (dashboard/pageEditor)
    4. You can also copy the iframe url of the app and paste to new tab for more easy to develop.

### Development Note

- In local development, all `/api/*` request will be re-write the origin via `LOCAL_API_URL=http://localhost:8000` env
- All api handled by symfony server **MUST**  be under ``/api`` path. The remaining request will be handled by nextjs
- For more information, please take a look at ``Procfile`` and ``nginx_app.conf`` file to know how the requests handling
- If you want to connect specific makaira domain/instance without using url params. Let provide below env for local development

```
    DEV_INSTANCE=
    DEV_DOMAIN=
```

  Local url for direct access will be
    * AppType = app: [http://localhost:3000]()
    * AppType = Content-Widget: [http://localhost:3000/content-widget?appType=content-widget]()
    * AppType = Content-Modal: [http://localhost:3000/content-modal?appType=content-modal]()

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
  DATABASE_URL=
```

## Additional Resources

- https://docs.makaira.io/docs/apps
- https://docs.makaira.io/docs/content-widgets
