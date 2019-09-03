/**
 * Get object helper
 *
 * @param {object} value
 * @returns {object}
 */
import {
  isPlainObject
} from 'lodash';

export default function(value) {
	return isPlainObject(value) ? value : {};
};