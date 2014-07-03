# CoreOS Web

Common stylesheets and AnguarlJS JavaScript ui components for CoreOS web apps.

## Setup

```
npm install -g grunt-cli
npm install
bower install
```

## Build

Simple build:
- run `grunt`  
- copy all files out of `/dist`

Build & bump other project:  
This will update the path config, copy it, build everything, then copy the resulting assets to your project directory.  

- edit the `coreosConfigs` paths in `bump.go` (not necessary if parent folder for other project is same as this one)
- run `go run bump.go <project-name>` where project name is the map key in `coreosConfigs`
- example: `go run bump.go etcd`


## Run Examples
- Start a static webserver like `python -m SimpleHTTPServer 8001` or similar.
- Run `grunt dev`
- Browse to `http://localhost:8001/examples`
