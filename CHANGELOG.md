#### Структура CHANGELOG:

-   Release version
-   Backwards compatibility
-   New features
-   Other changes and improvements
-   Bugsfix

#### Release

**IMPROVEMENTS:** *

**CHANGES:** *

**NEW FEATURES:** *

**BUGFIX:** *

## v1.0.0

**New features:**

- First felease

## v1.0.1

**Bugfix:**

- Entry path

**Improvements:**
- Documentation
- Update issue templates
- Add file LICENSE
- Add eslint
- Add build.sh

**Changes**
- Rename model class

## v1.0.2

**Bugfix:**
- Create instance base settings property (default model in _data). Example create model
```js
// before
class  PersonModel extends CreateModel {
    constructor(data = {}) {
      super(data);
      this._data = data;
    }
    .....
};

// after
class  PersonModel extends CreateModel {
    constructor(data) {
    	super(data);
    }
    .....
};
```
- Fix setter for settings "generateProperty"

**Improvements:**
- Add unit tests for interface model
- Add coverage
- Auto add "id" if response have`t return "id" after update

**Changes**
- Add git tags release