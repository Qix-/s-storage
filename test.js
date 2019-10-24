import * as Surplus from 'surplus';
import S from 's-js';
import data from 'surplus-mixin-data';

import {localSignal, sessionSignal} from '.';

const Root = ({greeting, firstName, lastName}) => (
	<div>
		<div style={{
			background: '#ddd',
			font: '14pt "Trebuchet MS"',
			padding: '1rem'
		}}>
			{greeting()}
		</div>
		<div>
			<label for="firstName">First Name:</label>&nbsp;<input type="text" id="firstName" fn={data(firstName)} />
		</div>
		<div>
			<label for="lastName">Last Name:</label>&nbsp;<input type="text" id="lastName" fn={data(lastName)} />
		</div>
	</div>
);

S.root(() => {
	const firstName = sessionSignal("myapp.name.first");
	const lastName = localSignal("myapp.name.last", {
		init: "Mustermann",
		factory: S.data,
		transform: null
	});

	const greeting = S.value();

	S(() => {
		if (firstName() && lastName()) {
			greeting(`Hello, ${firstName()} ${lastName()}!`);
		} else if (firstName()) {
			greeting(`Hello, ${firstName()}!`);
		} else if (lastName()) {
			greeting(`Hello, Mr./Ms. ${lastName()}!`);
		} else {
			greeting("Hello!");
		}
	});

	document.body.appendChild(Root({
		firstName,
		lastName,
		greeting
	}));
});
