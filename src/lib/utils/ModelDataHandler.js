/**
* Generate property base "data model"
*
* @private
* @param {object} data - data object
*/
import { each } from 'lodash'

export default function (fields = {}) {
  each(fields, (value, key) => {
    if (!Object.getOwnPropertyDescriptor(this, key)) {
      Object.defineProperty(this, key, {
        get: function () {
          return (typeof (this._data[key]) === 'undefined' || this._data[key] === null) ? '–' : this._data[key];
        },
        set: function (val) {
          this._data[key] = val;
        },
        configurable: true
      });
    }
  });
};
