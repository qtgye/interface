var Interface = require('../src/interface.js')

var personInterface = new Interface('PersonInterface', {
	firstName : 'string',
	lastName : 'string',
	getFullName : 'function',
})

var _person1 = {
	firstName : 'John',
	lastName : 'Doe',
	getFullName : function () {
		return this.firstName + ' ' + this.lastName
	}
};
var _person2 = {
	firstName : 'Jane',
}
var _person3 = {
	firstName : 'John',
	lastName : 'Wick',
	getFullName : 'Should be a function'
}

describe('Interface Object', () => {

	it('is created by instantiation', function () {
		expect((personInterface instanceof Interface)).toBe(true);
	});

	it('able to check if it is implemented on an object', () => {
		expect(personInterface.isImplementedBy(_person1)).toBe(true);
		expect(personInterface.isImplementedBy(_person2)).toBe(false);
		expect(personInterface.isImplementedBy(_person3)).toBe(false);
	})

	it('testAndGetReport generates a report when testing an object', () => {
		// Implemented interface
		var report1 = personInterface.testAndGetReport(_person1);
		// Missing 2 props
		var report2 = personInterface.testAndGetReport(_person2);

		expect(report1.isImplemented === true && report1.errors.length === 0).toBe(true);
		expect(report2.isImplemented === false && report2.errors.length === 2).toBe(true);
	})

	it('testAndThrow method throws an error when a tested object does not implement', () => {
		var missingProp = function () {
			// Missing 2 props
			personInterface.testAndThrow(_person2)
		}
		expect(missingProp).toThrow();
	})

	it('testAndThrow method allows custom error message', () => {
		var errorMessage = '_person2 does not implement PersonInterface. OMG!!!';
		var missingProp = function () {
			// Missing 2 props
			personInterface.testAndThrow(_person2,errorMessage)
		}
		expect(missingProp).toThrowError(errorMessage);
	})

	it('testAndThrow method allows custom error type as well', () => {
		var errorType = SyntaxError;
		var missingProp = function () {
			// Missing 2 props
			personInterface.testAndThrow(_person2,'OMG!!!',SyntaxError)
		}
		expect(missingProp).toThrowError(SyntaxError);
	})

});