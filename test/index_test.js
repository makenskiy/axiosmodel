import _ from 'lodash';
import PersonModel from './PersonModel';

const DEFAULT_MODEL_PROPERTIES = ['_data', 'id', 'email', 'first_name', 'last_name', 'avatar'];
const DEFAULT_MODEL_CRUD = ['create', 'delete', 'get', 'list', 'update'];
const DEMO_USER = {
  id: 4,
  last_name: 'Holt',
  first_name: 'Eve',
  email: 'eve.holt@reqres.in',
  avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg'
};

const model = new PersonModel();
const modelUser = new PersonModel(DEMO_USER);

describe('Check instance PersonModel', () => {
  it('Has empty instance', (done) => {
    if (!model instanceof PersonModel) {
      throw new Error('Not found instance PersonModel');
    }
    done();
  });

  it('Has data instance', (done) => {
    if (!modelUser instanceof PersonModel) {
      throw new Error('Not found instance PersonModel');
    }
    done();
  });

  it('Has user in data instance', (done) => {
    _.each(DEMO_USER, (value, key) => {
      if (modelUser._data[key] !== value) {
        throw new Error(`Not equal property ${key} value: ${value} !== ${modelUser._data[key]}`);
      }
    });
    done();
  });

  it('Has custom getter', (done) => {
    if (!modelUser.name) {
      throw new Error('Not found');
    }
    const name = modelUser.name.split(' ');
    if ((modelUser.first_name !== name[0]) || modelUser.last_name !== name[1]) {
      throw new Error('Name error');
    }
    done();
  });

  it('Has custom setter', (done) => {
    modelUser.name = { first_name: 'first_name', last_name: 'last_name' };
    if (modelUser.first_name !== 'first_name' || modelUser.last_name !== 'last_name') {
      throw new Error('Setter name error');
    }
    done();
  });

  it('Has CRUD methods', (done) => {
    DEFAULT_MODEL_CRUD.forEach((item) => {
      if (!_.isFunction(model.__resource[item])) {
        throw new Error(`Not found method ${item}`);
      }
    });
    done();
  });
});

describe('Check CRUD && other public methods', () => {

  describe('GET list()', () => {
    it('Get', (done) => {
      let loading = true;

      PersonModel.list({ foo: 'bar' }, (res) => {
        if (!_.get(res, 'config.params.foo')) {
          throw new Error('Not found string params /path/to?foo=bar');
        }
        if (!_.get(res, 'config.params.per-page')) {
          throw new Error('Not found string params /api?per-page=25');
        }
      }).then((res) => {
        if (!_.isArray(res)) {
          throw new Error('Not found data');
        }

        res.forEach((el) => {
          DEFAULT_MODEL_PROPERTIES.forEach((key) => {
            if (!_.has(el, key)) {
              throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
            }

            if (!Object.keys(el._data).length) {
              throw new Error('Not found property in model _data');
            }
          });
        });

        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = PersonModel.loading;
        if (loading) throw new Error('Not loading state for list()');
      });
    });
  });

  describe('GET get()', () => {
    it('Get', (done) => {
      let loading = true;

      PersonModel.get({ id: 1, foo: 'bar' }, (res) => {
        if (!_.get(res, 'config.params.foo')) {
          throw new Error('Not found string params /path/to/1?foo=bar');
        }
        const id = res.config.url[res.config.url.length - 1];
        if (id != 1) {
          throw new Error('Not found id /path/to/:ID');
        }
      }).then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        DEFAULT_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });

        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = PersonModel.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });
  });

  describe('POST create()', () => {
    it('create example 1', (done) => {
      let loading = true;
      let model1 = new PersonModel();
      model1.first_name = 'first_name';
      model1._data.last_name = 'last_name';

      model1.create().then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        if (_.get(res, '_data.first_name') !== 'first_name') {
          throw new Error('Error first_name property');
        }

        if (_.get(res, '_data.last_name') !== 'last_name') {
          throw new Error('Error last_name property');
        }

        DEFAULT_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });
        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = model1.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });

    it('create example 2', (done) => {
      let loading = true;
      let model1 = new PersonModel();

      model1.create({
        first_name: 'first_name'
      }).then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        if (_.get(res, '_data.first_name') !== 'first_name') {
          throw new Error('Error first_name property');
        }

        DEFAULT_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });
        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = model1.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });

    it('create example 3', (done) => {
      let loading = true;
      let model1 = new PersonModel();
      const CUSTOM_MODEL_PROPERTIES = ['first_name'];

      model1.create({
        first_name: 'asdasdsd',
        last_name: 'asdasdsd',
        foo: 'bar'
      }, ['first_name']).then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        if (_.get(res, '_data.last_name')) {
          throw new Error('Error: create last_name property');
        }

        if (_.get(res, '_data.foo')) {
          throw new Error('Error: create foo property');
        }

        if (_.get(res, '_data.first_name') !== 'asdasdsd') {
          throw new Error('Error first_name property');
        }

        CUSTOM_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });
        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = model1.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });

    it('create callback', (done) => {
      let model1 = new PersonModel();

      model1.create({
        first_name: 'asdasdsd',
        last_name: 'asdasdsd',
        foo: 'bar'
      }, [], (res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }
        done();
      });
    });
  });

  describe('GET update()', () => {
    it('update example 1', (done) => {
      let loading = true;
      let model1 = new PersonModel(DEMO_USER);

      model1.first_name = 'first_name';
      model1._data.last_name = 'last_name';

      model1.update().then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        if (_.get(res, '_data.first_name') !== 'first_name') {
          throw new Error('Error first_name property');
        }

        if (_.get(res, '_data.last_name') !== 'last_name') {
          throw new Error('Error last_name property');
        }

        DEFAULT_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });
        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = model1.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });

    it('update example 2', (done) => {
      let loading = true;
      let model1 = new PersonModel(DEMO_USER);

      model1.update({
        first_name: 'first_name',
        last_name: 'last_name',
        foo: 'bar'
      }, ['first_name']).then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        if (_.get(res, '_data.first_name') !== 'first_name') {
          throw new Error('Error first_name property');
        }

        DEFAULT_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });
        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = model1.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });

    it('update example 3', (done) => {
      let loading = true;
      let model1 = new PersonModel(DEMO_USER);

      model1.update({
        last_name: 'last_name',
        first_name: 'first_name',
        ...DEMO_USER
      }).then((res) => {
        if (!_.isObject(res)) {
          throw new Error('Not found data');
        }

        if (_.get(res, '_data.first_name') !== 'first_name') {
          throw new Error('Error first_name property');
        }

        DEFAULT_MODEL_PROPERTIES.forEach((key) => {
          if (!_.has(res, key)) {
            throw new Error(`Not found property ${key} in model. Check model params.generateProperty`);
          }

          if (!Object.keys(res._data).length) {
            throw new Error('Not found property in model _data');
          }
        });
        done();
      }, (err) => {
        throw err; // @todo check return error
      }).finally(() => {
        loading = model1.loading;
        if (loading) throw new Error('Not loading state for get()');
      });
    });
  });
});
