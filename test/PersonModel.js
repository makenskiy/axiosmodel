import CONFIG from './config';
import { CreateModel } from '../src';

export default class PersonModel extends CreateModel {
  constructor(data) {
    super(data);
  }

  static get _opts() {
    return CONFIG.PARAMS;
  }

  get name() {
    return `${this._data.first_name} ${this._data.last_name}`;
  }

  set name({first_name, last_name}) {
    this._data.first_name = first_name;
    this._data.last_name = last_name;
  }
}
