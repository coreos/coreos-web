# CoreOS Web

Common stylesheets and AnguarlJS JavaScript ui components for CoreOS web apps.

## Setup

```
npm install -g grunt-cli
npm install
bower install
```

## Build

Edit the `$coreosWebDistPath` variable in `/src/sass/_path-config.scsss` to point the correct path for your application (necessary for font and image paths to be configured properly).

run `grunt`  
copy all files out of `/dist`
