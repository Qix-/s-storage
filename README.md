# s-storage

`localStorage` and `sessionStorage` binding for S.js signals.

## Usage

```console
$ npm i --save s-storage
```

```javascript
// `localSignal` and `sessionSignal` have the exact same API.
import {localSignal, sessionSignal} from 's-localstorage';

const name = localSignal(
	'user.name', // localStorage key to bind to
	'Josh',      // (optional) initial value
	S.value      // (optional) signal factory (either S.value (the default) or S.data)
);

S.root(() => {
	S(() => console.log(`Hello, ${name()}!`));

	console.log(localStorage.getItem('user.name')); //-> Josh
	name('Dylan'); // logs "Hello, Dylan!"
	console.log(localStorage.getItem('user.name')); //-> Dylan
	localStorage.setItem('user.name', 'Brad'); // logs "Hello, Brad!"
	console.log(name()); //-> Brad
});
```

# License
Copyright &copy; 2019 by Josh Junon. Released under the MIT License.