import S from 's-js';

let hasWarnedLocal = false;
let hasWarnedSession = false;

function makeStorageSignal(driver, sig, key, initValue, transform) {
	const serialize = (transform || {}).stringify || (v => v);
	const deserialize = (transform || {}).parse || (v => v);

	let paused = false;

	S.on(sig, () => {
		if (sig() === null) {
			driver.removeItem(key);
			return;
		}

		try {
			paused = true;
			driver.setItem(key, serialize(sig()));
		} finally {
			paused = false;
		}
	}, null, true);

	window.addEventListener('storage', e => {
		if (!paused && e.isTrusted && e.key === key) {
			sig(deserialize(e.newValue));
		}
	});

	let existing = driver.getItem(key);
	if (existing === null) {
		sig(initValue);
	} else {
		sig(deserialize(existing));
	}

	return sig;
}

export function localSignal(key, {init=null, factory=S.value, transform=JSON} = {}) {
	const sig = factory(init);

	if (typeof localStorage !== 'object') {
		if (!hasWarnedLocal) {
			console.warn('localStorage is invalid (either not defined or not an object); s-storage will not persist anything!');
			hasWarnedLocal = true;
		}

		return sig;
	}

	return makeStorageSignal(
		localStorage,
		sig,
		key,
		init,
		transform
	);
}

export function sessionSignal(key, {init=null, factory=S.value, transform=JSON} = {}) {
	const sig = factory(init);

	if (typeof sessionStorage !== 'object') {
		if (!hasWarnedSession) {
			console.warn('sessionStorage is invalid (either not defined or not an object); s-storage will not persist anything!');
			hasWarnedSession = true;
		}

		return sig;
	}

	return makeStorageSignal(
		sessionStorage,
		sig,
		key,
		init,
		transform
	);
}
