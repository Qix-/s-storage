# s-storage

`localStorage` and `sessionStorage` binding for S.js signals.

## Usage

```console
$ npm i --save s-storage
```

```javascript
// `localSignal` and `sessionSignal` have the exact same API.
//
//     localSignal(key, {init, factory, transform} = {})
//     sessionSignal(key, {init, factory, transform} = {})
//
import {localSignal, sessionSignal} from 's-storage';

const name = localSignal(
	'user.name',           // localStorage key to bind to

	// (optional) options object 
	{
		// (optional) initial value
		init: 'Josh',
	
		// (optional) signal factory (either S.value (the default) or S.data)
		factory: S.value,

		// (optional) (de)serialization functions
		//
		// These are called before/after values are stored/loaded.
		// Defaults to `JSON` (which means by default all values
		// stored in storage are JSON strings).
		//
		// Set to null to disable altogether (but remember that
		// local storage values are always strings and the browser
		// calls .toString() on all values)
		transform: {
			stringify: v => v,
			parse: v => v
		}
	}
);

S.root(() => {
	S(() => console.log(`Hello, ${name()}!`));

	// Signal -> Storage binding
	console.log(localStorage.getItem('user.name')); //-> Josh
	name('Dylan'); // logs "Hello, Dylan!"
	console.log(localStorage.getItem('user.name')); //-> Dylan

	// Storage -> Signal binding
	localStorage.setItem('user.name', 'Brad'); // logs "Hello, Brad!"
	console.log(name()); //-> Brad

	// Deletion (storage item gets removed entirely)
	name(null);
	localStorage.getItem('user.name'); //-> null
	name("Cynthia");
	localStorage.removeItem('user.name'); // logs "Hello, null!"
	name(); //-> null
});
```

# License
Copyright &copy; 2019 by Josh Junon. Released under the MIT License.
