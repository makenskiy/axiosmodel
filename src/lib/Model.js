import {
  isPlainObject,
  isArray,
  isFunction,
  isBoolean,
  find,
  last,
  get,
  extend,
  keys,
  pick,
  each,
  unset
} from 'lodash';

import axios from 'axios';
import { DEFAULTS } from './constants'
import { ModelDataHandler, getPlainObject, parseQuery } from './utils'

let RESOURCES = {};
let OPTIONS = {};

/**
 * Parse response helper
 *
 * @param {object} response
 * @returns {@link __class} - return model
 * @private
 */
let parseResponse = function(response) {
  let body = get(response, this.__options ? this.__options.responsePath : this.__class.__options.responsePath);

	if (isArray(body)) {
		return body.map(itemData => {
      let item = new this.__class(itemData);

      if ((this.__options ? this.__options.generateProperty : this.__class.__options.generateProperty) && (itemData && item)) {
        ModelDataHandler.bind(item)(itemData);
      }
			return item;
		});
	} else {
    let model = new this.__class(body);
    if ((this.__options ? this.__options.generateProperty : this.__class.__options.generateProperty) && (model && body)) {
      ModelDataHandler.bind(model)(body);
    }

    return model;
  }
};

/**
 * Create Model
 *
 * @description Class for CRUD оperations and wrap response data
 * @export
 * @class CreateModel
 * @todo Create Method for extend base __resource(). Optimuze size build
 *
 * @example
 * // Example PersonModel for test
 *
 * // Create class
 * import { CreateModel } from '@makenskiy/axiosmodel'
 *
 * // Test doc user
 * const DEMO_USER = {
 *   id: 4,
 *   last_name: 'Holt',
 *   first_name: 'Eve',
 *   email: 'eve.holt@reqres.in',
 *   avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg'
 * };
 *
 * // Setting for PersonModel
 * const PARAMS = {
 *   generateProperty: true,
 *   base: 'https://reqres.in/api',
 *   path: '/users',
 *   properties: {
 *     avatar: '',
 *     email: '',
 *     last_name: '',
 *     first_name: ''
 *   }
 * };
 *
 * class PersonModel extends CreateModel {
 *   constructor(data = {}) {
 *     super();
 *     this._data = data;
 *   }
 *
 *   static get _opts() {
 *     return PARAMS;
 *   }
 *
 *   // Add new getter/setter merge name (optional)
 *   get name() {
 *     return `${this._data.first_name} ${this._data.last_name}`
 *   }
 *
 *   set name({first_name, last_name}) {
 *     this._data = first_name + ' new'
 *     this._data = last_name + ' new'
 *   }
 *
 *   // Custome getter email (optional)
 *   get email() {
 *     return this._data.email ? this._data.email : '–'
 *   }
 * };
 *
 * // Request list (array data). @see {@link list} for further information.
 * // Request get (single data). @see {@link get} for further information.
 * // Request update (single data). @see {@link update} for further information.
 * // Request create (single data). @see {@link create} for further information.
 * // Request delete (single data). @see {@link delete} for further information.
 * // Method cache on/off. @see {@link cache} for further information.
 * // Method add/remove headers. @see {@link headers} for further information.
 */
export default class CreateModel {
	static get __class() {
		return this;
  }

  /**
   * Get model default properties
   *
   * @readonly
   * @static
   * @memberof CreateModel
   * @returns {object}
   *
   * // show properties
   * console.log(PersonModel.properties)
   */
  static get properties() {
    return this.__options.properties || {}
  }

  /**
   * Get/Set state loading
   *
   * @static
   * @memberof CreateModel
   * @example
   * console.log(PersonModel.loading)
   */
  static get loading() {
    return isBoolean(get(this.__options, 'loading')) ? this.__options.loading : this.__class.__options.loading
  }

  static set loading(val) {
    if (isBoolean(get(this.__options, 'loading'))) {
      this.__options.loading = val
    } else {
      this.__class.__options.loading = val
    }
  }

	/**
   * Common CRUD methods
   *
   * @readonly
   * @private
   * @static
   * @memberof CreateModel
   */
  static get __resource() {
		let name = this.name;
		let resource = RESOURCES[name];
		if (!resource) {
      let url = `${this.__options.base || ''}${this.__options.path}`;
      resource = RESOURCES[name] = {
        // GET /path/to/:id
        // GET /path/to?id=:id
        // GET /path/to/:id?foo=bar&foo=bar
        get: (arg) => {
          const parse = parseQuery(arg);
          return axios({
            method: 'GET',
            url: `${url}/${arg.id || arg._id || ''}`,
            params: parse.query,
            ...parse.config
          })
        },

        // GET /path/to
        // GET /path/to?foo=bar&foo=bar
        list: (arg) => {
          const parse = parseQuery(arg);
          return axios({
            method: 'GET',
            url: url,
            params: arg,
            ...parse.config
          })
        },

        // DELETE /path/to/:id
        delete: (arg) => {
          return axios({
            method: 'DELETE',
            url: `${url}/${arg.id || arg._id || ''}`
          })
        },

        // PUT /path/to/:id { foo: 'bar' }
        // PUT /path/to?id=:id { foo: 'bar' }
        // PUT /path/to { id: :id, foo: 'bar' }
        update: (arg) => {
          const parse = parseQuery(arg);
          return new Promise((resolve, reject) => {
            axios({
              method: 'PUT',
              url: `${url}/${arg.id || arg._id || ''}`,
              data: parse.query,
              ...parse.config
            }).then(res => {
              resolve({
                ...res,
                data: {
                  data: res.data
                }
              })
            }, err => {
              reject(err)
            })
          })
        },

        // POST /path/to { foo: 'bar' }
        create: (arg) => {
          const parse = parseQuery(arg);
          return new Promise((resolve, reject) => {
            axios({
              method: 'POST',
              url: url,
              data: parse.query,
              ...parse.config
            }).then(res => {
              resolve({
                ...res,
                data: {
                  data: res.data
                }
              })
            }, err => {
              reject(err)
            })
          })
        }
      }
		}
		return resource;
	}

	/**
   * Call resource methods
   *
   * @static
   * @private
   * @param {string} name - method name
   * @param {array} args - request arguments
   * @returns {promise} - current method
   * @memberof CreateModel
   */
  static __method(name, ...args) {
    let cb = last(args);
		let opts = this.__class.__options;
    let methodExtParams = get(opts, 'params', {})[name];

		if (opts && methodExtParams) {
			let methodParams = args[0];
			if (isPlainObject(methodParams)) extend(methodParams, methodExtParams);
    }
    this.loading = true
    return Promise.resolve(this.__resource[name](...args)) //
			.then(response => {
        if (isFunction(cb)) {
          cb(response);
        }
        this.loading = false
        if (find([200, 201], item => item === response.status)) {
          return parseResponse.call(this, response);
        } else {
          return response
        }
			});
	}

	static get __options() {
    let name = this.name;
		return OPTIONS[name] || (OPTIONS[name] = extend({}, DEFAULTS, this._opts));
	}

	get __class() {
    return this.constructor;
	}

	get __resource() {
		return this.__class.__resource;
	}

	__method(...args) {
		return this.__class.__method.apply(this, args);
	}

	__fieldsAll(fields) {
		return isArray(fields) && fields.length ? fields : keys(this._data);
  }

  /**
   * Method API (single object)
   *
   * @static
   * @param {object} params - id dequired prop. this object query string params, expamle { id: 4, foo: 'bar' }
   * @param {function} cb - callback return all response
   * @returns {promise} - Class wraped response data
   * @example
   * // Get single object
   * PersonModel.get({ id: 4 }).then(res => {
   *   console.log('get', res)
   * }, err => {
   *   console.err('err get', err)
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   *
   * // Get single object
   * PersonModel.get({ id: 4, foo: 'bar' }).then(res => {
   *   console.log('get', res)
   * }, err => {
   *   console.err('err get', err)
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   */
  static get(params, cb) {
		return this.__method('get', getPlainObject(params), cb);
	}

	/**
   * Method API (Array object)
   *
   * @static
   * @param {object} query - this object query string params, expamle { foo: 'bar' }
   * @param {function} cb - callback return all response
   * @returns {promise} - Class wraped response data
   * @example
   * // Get array list objects
   * PersonModel.list().then(res => {
   *   console.log('list', res)
   * }, err => {
   *   console.err('err list', err)
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   *
   * // Get response information && string params to request
   * PersonModel.list({ foo: 'bar' }, response => {
   *   console.log('response', response)
   * }).then(res => {
   *   console.log('list', res)
   * }, err => {
   *   console.err('err list', err)
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   */
  static list(query, cb) {
		query = getPlainObject(query);
		if (!query['per-page']) query['per-page'] = this.__options.perPage;
		return this.__method('list', extend({}, query), cb);
	}

	/**
   * Add/Delete cache header to request
   *
   * @static
   * @param {boolean} status - add Cache-Control or delete
   * @returns {@link CreateModel} - CreateModel this
   * @example
   * PersonModel.cache().get({ id: 1 }).then(res => {
   *   console.log('cache', res)
   *   PersonModel.cache(true)
   * })
   */
  static cache(status) {
		if (!status) {
			axios.defaults.headers.common['Cache-Control'] = 'no-cache';
		} else {
			delete axios.defaults.headers.common['Cache-Control'];
		}
		return this;
	}

	/**
   * Add headers to request. WARN, it`s global add axios
   *
   * @static
   * @param {object} headers - { key: 'value' }
   * @returns {@link CreateModel} - CreateModel this
   * @example
   * // Add custom headers
   * PersonModel.headers({
   *   Authorization: 'Bearer token'
   * })
   *
   * // Delete all custom headers
   * PersonModel.headers(null, true)
   */
  static headers(headers = {}, del) {
    if (del) {
      each(axios.defaults.headers.common, (value, key) => {
        if (key !== 'Accept') unset(axios.defaults.headers.common, key)
      })
      return this;
    }

    each(headers, (value, key) => axios.defaults.headers.common[key] = String(value))
		return this;
	}

	/**
   * Method API (Create object)
   *
   * @param {object} [params={}] - body
   * @param {array} fields - update fields
   * @param {function} cb - return all response
   * @returns {promise}
   * @example
   * // Create model PersonModel
   * let model = new PersonModel()
   *
   * // Example create 1
   * model._data.first_name = 'asdasdsd'
   *
   * model.create().then(res => {
   *   console.log('create', res)
   * })
   *
   * // Example create 2
   * model.create({
   *  first_name: 'asdasdsd'
   * }).then(res => {
   *   console.log('create', res)
   * })
   *
   * // Example create 3 (only first_name)
   * model.create({
   *  first_name: 'asdasdsd',
   *  last_name: 'asdasdsd'
   * }, ['first_name']).then(res => {
   *   console.log('create', res)
   * })
   */
  create(params = {}, fields, cb) {
    params = Object.assign(params, this._data)
    let patch = Object.assign(this.__class.properties, pick(params, this.__fieldsAll(fields)))
    return this.__method('create', patch, cb);
	}

	/**
   * Method API (Delete object)
   *
   * @param {function} cb - return all response
   * @returns {promise}
   */
  delete(cb) {
    return this.__method('delete', { id: this._data.id }, cb);
	}

	/**
   * Method API (Update object)
   *
   * @param {object} [params=this._data] - Object model, example DEMO_USER
   * @param {array} fields - apdate fields, example ['foo', 'bar']
   * @param {function} cb - callback return all response
   * @returns {promise}
   * @example
   * // Create model
   * let model = new PersonModel(DEMO_USER)
   *
   * // Example update 1 (only field last_name)
   * model.update({
   *   last_name: 'aasdsad'
   *   first_name: 'Eve'
   * }, ['last_name']).then(res => {
   *   console.log('update by field', res) // updated last_name
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   *
   * // Example update 2
   * model._data.last_name = 'aasdsad'
   *
   * model.update().then(res => {
   *   console.log('update by field', res) // all updated
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   *
   * // Example update 3
   * model.update({
   *   last_name: 'aasdsad',
   *   first_name: 'aasdsad',
   *   ...DEMO_USER
   * }).then(res => {
   *   console.log('update by field', res) // all updated
   * }).finally(() => {
   *   console.log('loading state', PersonModel.loading) // for your app
   * })
   */
  update(params = this._data, fields, cb) {
    let patch = pick(this._data, this.__fieldsAll(fields));
    return this.__method('update', extend(getPlainObject({ id: this._data.id }), getPlainObject(params)), patch, cb);
	}
};
