# CoreOS Web

[![deprecated](http://badges.github.io/stability-badges/dist/deprecated.svg)](http://github.com/badges/stability-badges)

Common stylesheets and AngularJS UI components for CoreOS web apps.

## Setup
```
npm install -g gulp
npm install
bower install
```

## Build
Simple build:
- run `gulp`
- copy all files out of `/dist`

Build & bump other project:  
This will build everything, then copy the resulting assets to your project directory.  

- create/edit the `.bumpcfg` file to export your project names with their path to coreos-web.  
  example: `export myproject=$GOPATH/src/github.com/myproject/web/coreos-web`
- run `./bump.sh <project-name>` where project-name is the env var in `.bumpcfg`  
  example: `./bump.sh myproject`


## Run Examples
- Run `gulp dev`
- Run `gulp serve`
- Browse to `http://localhost:9001/examples`


## JavaScript Requirements
This library depends on and assumes compatible versions of all external libraries included in [src/coreos.js](src/coreos.js).
