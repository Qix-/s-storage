import S from 's-js';

let hasWarnedLocal = false;
let hasWarnedSession = false;

function makeStorageSignal(driver, sig, key, initValue) {
	S.on(sig, () => {
		if (sig() === null) {
			driver.removeItem(key);
			return;
		}

		const existing = driver.getItem(key);
		if (existing !== sig()) {
			driver.setItem(key, sig());
		}
	}, null, true);

	window.addEventListener('storage', e => {
		if (e.isTrusted && e.key === key) {
			sig(e.newValue);
		}
	});

	let existing = driver.getItem(key);
	if (existing === null) existing = initValue;
	sig(existing);

	return sig;
}

export function localSignal(key, initValue = null, signalFactory = S.value) {
	const sig = signalFactory(initValue);

	if (typeof localStorage !== 'object') {
		if (!hasWarnedLocal) {
			console.warning('localStorage is invalid (either not defined or not an object); s-storage will not persist anything!');
			hasWarnedLocal = true;
		}

		return sig;
	}

	return makeStorageSignal(
		localStorage,
		sig,
		key,
		initValue
	);
}

export function sessionSignal(key, initValue = null, signalFactory = S.value) {
	const sig = signalFactory(initValue);

	if (typeof sessionStorage !== 'object') {
		if (!hasWarnedSession) {
			console.warning('sessionStorage is invalid (either not defined or not an object); s-storage will not persist anything!');
			hasWarnedSession = true;
		}

		return sig;
	}

	return makeStorageSignal(
		sessionStorage,
		sig,
		key,
		initValue
	);
}
