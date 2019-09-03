/**
 * Parse query helper. Unset id
 *
 * @param {object} query
 * @returns {object} - query && config
 * @example
 * parseQuery({id: 1, foo: 'bar', config: {
  *   responseType: 'blob'
  * }})
  */
import {
  pickBy,
  find
} from 'lodash';

export default (query) => {
  const queryExl = ['id', 'config'];
  return {
    query: pickBy(query, (value, key) => {
      return !find(queryExl, item => item  === key);
    }),
    config: {
      ...query.config,
    }
  };
};