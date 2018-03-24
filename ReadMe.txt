

Initialize the minitoast library and we’re ready to go.

	let instance = new minitoast();

Create toast notifications with different styles.

	instance.success('Success message');
	instance.warning('Warning message');
	instance.error('Error message');
	instance.info('Info message');
	instance.default('Default message');


Set the timeout in milliseconds.

	notif: {
	  timeout: 5000
	}

Default messages & colors for the popup.

	msgs: {
		s: ['', 'Success', 'mt-success'],
		w: ['', 'Warning', 'mt-warning'],
		e: ['', 'Error', 'mt-error'],
		i: ['', 'Info', 'mt-info'],
		d: ['', 'Notification', 'mt-default']
	}
