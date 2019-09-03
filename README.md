
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

    npm i AxiosModel

## Include you project

    import { AxiosModel } from 'AxiosModel'

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
			this._data = data;
		}

		static get _opts() {
			return PARAMS;
		}

		get name() {
			return `${this._data.first_name} ${this._data.last_name}`;
		}

		set name({first_name, last_name}) {
			this._data.first_name = first_name;
			this._data.last_name = last_name;
		}
	};
