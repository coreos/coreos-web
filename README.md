# CoreOS Web

Common stylesheets and AnguarlJS JavaScript ui components for CoreOS web apps.

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
- Run `gulp`
- Browse to `http://localhost:9000/examples`
