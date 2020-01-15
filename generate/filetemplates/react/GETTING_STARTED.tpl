## Getting started for @sencha/ext-react-{toolkit}{bundle}

last run: {now}

Getting started with @sencha/ext-react-{toolkit}{bundle} and create-react-app

### Login to the Sencha npm repo

* Note, you must be signed into the Sencha npm registry to access packages.
See [Authenticating to Sencha's npm Registry](getting_started.html#getting_started_-_authenticating_to_sencha_s_npm_registry)
for more information.

production:

```sh
npm login --registry=https://npm.sencha.com/ --scope=@sencha
```

early adopter:

```sh
npm login --registry=https://sencha.myget.org/F/early-adopter/npm/ --scope=@sencha
```

### Create a React application with create-react-app

- Run the following:

```sh
npx create-react-app ext-react-{toolkit}{bundle}-demo --template @sencha/ext-react-{toolkit}{bundle}
```

create-react-app will create a new application using the ext-react-{toolkit}{bundle} template
(from the sencha/ext-react git repo)

- When create-react-app is completed, Run the following:

```sh
cd ext-react-{toolkit}{bundle}-demo
```

- To change the theme, edit 'public/index.html' and uncomment one of the links below this line:

```sh
<script src="%PUBLIC_URL%/ext-runtime-{toolkit}{bundle}/themes/css.{toolkit}.material.js"></script>
```

- To start the ExtReact application, run the following in a terminal window:

```sh
npm start
```

The ExtReact application will load in a browser window!
