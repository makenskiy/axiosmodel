
# Axios Model

Create model base [axios](https://github.com/axios/axios). 
Wrap class your response for get/set fields and CRUD operations (REST API).

## feature

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
| generateProperty  | Boolean  | No  | Auto generation properties base "_data"  |
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
    constructor(data = {}) {
    	super();
    	this._data = data; // required
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
 // GET https://reqres.in/api/users?foo=bar
  PersonModel.list({ foo: 'bar' }).then(res => {
    console.log('list', res)
  }, err => {
    console.err('err list', err)
  }).finally(() => {
    console.log('loading state', PersonModel.loading) // for your app
  })
```

## Documentation

[makenskiy.github.io/axiosmodel](https://makenskiy.github.io/axiosmodel/)