'use strict';

// a sample discovery json for testing
angular.module('mocks').value('mocks.discovery', {
  "kind": "discovery#restDescription",
  "discoveryVersion": "v1",
  "id": "mock:v1",
  "name": "schema",
  "version": "v1",
  "title": "mock API",
  "description": "",
  "documentationLink": "http://github.com/sym3tri/mock",
  "protocol": "rest",
  "icons": {
    "x16": "",
    "x32": ""
  },
  "labels": [],
  "rootUrl": "http://localhost:9090/",
  "servicePath": "mock/v1/",
  "batchPath": "batch",
  "parameters": {},
  "auth": {},
  "schemas": {
    "user": {
      "id": "user",
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "firstName": {
          "type": "string"
        },
        "lastName": {
          "type": "string"
        }
      }
    },
    "userPage": {
      "id": "userPage",
      "type": "object",
      "properties": {
        "users": {
          "type": "array",
          "items": {
            "$ref": "user"
          }
        },
        "nextPageToken": {
          "type": "string"
        }
      }
    }
  },
  "resources": {


    "users": {
      "methods": {
        "list": {
          "id": "mock.users.list",
          "description": "Retrieve a page of Users.",
          "httpMethod": "GET",
          "path": "users",
          "parameters": {
            "nextPageToken": {
              "type": "string",
              "location": "query"
            }
          },
          "response": {
            "$ref": "userPage"
          }
        },
        "get": {
          "id": "mock.users.get",
          "description": "Retrieve a User.",
          "httpMethod": "GET",
          "path": "users/{id}",
          "parameterOrder": [
            "id"
          ],
          "parameters": {
            "id": {
              "type": "string",
              "location": "path"
            }
          },
          "response": {
            "$ref": "user"
          }
        },
        "destroy": {
          "id": "mock.users.destroy",
          "description": "Destroy a User.",
          "httpMethod": "DELETE",
          "path": "users/{id}",
          "parameterOrder": [
            "id"
          ],
          "parameters": {
            "id": {
              "type": "string",
              "location": "path"
            }
          }
        }
      }
    }
  }
});
