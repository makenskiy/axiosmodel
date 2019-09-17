
# Axios Model

Create model base [axios](https://github.com/axios/axios).
Wrap class your response for get/set fields and CRUD operations (REST API).

## Feature

 - Wrap class your response
 - Get/Set custom fields
 - Get/Set original fields
 - Method create (POST)
 - Method update (PUT)
 - Method delete (DELETE)
 - Method list (GET)
 - Method get (GET)
 - Method Get/Set custom request headers
 - Method cache (Cache-Control)

## Install

```bash
npm i @makenskiy/axiosmodel
```

## Params setting

| Name  | Type | Required | Description
| ------------- | ------------- | ------------- | ------------- |
| generateProperty  | Boolean  | No  | Auto generation properties base original data (_data property)  |
| base  | String   | Yes  | API domain  |
| path  | String   | Yes  | API Endpoint  |
| properties  | Object   | No  |  Default properties model |

## Include you project

```js
import { CreateModel } from '@makenskiy/axiosmodel'

// Settings
const  PARAMS  = {
   generateProperty:  true,
   base:  'https://reqres.in/api',
   path:  '/users',
   properties: {
      avatar:  '',
      email:  '',
      last_name:  '',
      first_name:  ''
   }
};

// Create model class
class  PersonModel extends CreateModel {
    constructor(data) {
    	super(data);
    }

    // required
    static get _opts() {
    	return PARAMS;
    }

    // Add custom property (optional)
    get name() {
    	return `${this._data.first_name} ${this._data.last_name}`;
    }

    set name({first_name, last_name}) {
		this._data.first_name = first_name;
		this._data.last_name = last_name;
	}
};
```

Example. Get array response. See documentation for use more methods

```js
 // GET https://reqres.in/api/users?foo=bar&per-page=25
  PersonModel.list({ foo: 'bar' }).then(res => {
    console.log('list', res)
  }, err => {
    console.err('err list', err)
  }).finally(() => {
    console.log('loading state', PersonModel.loading) // for your app
  })
```

Example return
```js
[
    {
        // original data
        "_data": {
            "id": 1,
            "email": "makenskiy@gmail.com",
            "first_name": "Victor",
            "last_name": "Makenskiy",
            "avatar": null
        },
        
        // CRUD methods by instance
        "_proto_": {
            "delete": "(arg) => (Promise)",
            "update": "(arg) => (Promise)",
            "create": "(arg) => (Promise)"
        },
        
        // Getters && setters
        "get id": 1,
        "set id": "(val) => {...}",
        "get email": "makenskiy@gmail.com",
        "set email": "(val) => {...}",
        "get first_name": "Victor",
        "set first_name": "(val) => {...}",
        "get last_name": "Makenskiy",
        "set last_name": "(val) => {...}",
        "get avatar": "-",
        "set avatar": "(val) => {...}",
        "get name": "Victor Makenskiy",
        "set name": "(val) => {...}",
    }
]
```

Example your html. Render after load.

| name  | first_name | last_name | email | avatar | edit button | delete button | add button |
| ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- | ------------- |
| Victor Makenskiy  | Victor  | Makenskiy  | makenskiy@gmail.com  |  -  | call update()  | call delete()  | create new empty instance && call create()  |


## Documentation

[makenskiy.github.io/axiosmodel](https://makenskiy.github.io/axiosmodel/)

# Development

Use development tools

## Install

```bash
git clone https://github.com/makenskiy/axiosmodel.git && cd axiosmodel && npm i
```

## Run dev
```bash
npm run dev
```

## Run build
```bash
npm run build
```

## Run test
```bash
// Build mode
npm run unit:single

// Dev mode
npm run unit:watch
```

## Generate documentation
```bash
npm run jsdoc
```