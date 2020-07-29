/**
* Generate property base "data model"
*
* @private
* @param {object} data - data object
*/
import { each } from 'lodash';

export default function (fields = {}) {
  each(fields, (value, key) => {
    if (!this.__lookupGetter__(key)) {
      Object.defineProperty(this, key, {
        get: () => {
          return typeof this._data[key] === 'undefined' || this._data[key] === null ? '–' : this._data[key];
        },
        set: (val) => {
          this._data[key] = val;
        },
        configurable: true
      });
    }
  });
}
