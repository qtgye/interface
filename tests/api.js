var Interface = require('../src/interface.js')
var personInterface = new Interface('PersonInterface', {
	firstName : 'string',
	lastName : 'string',
	getFullName : 'function'	
});
// Valid implementation
var _person1 = {
	firstName : 'John',
	lastName : 'Doe',
	getFullName : function () {
		return this.firstName + ' ' + this.lastName
	}
};
// Missing 2 props
var _person2 = {
	firstName : 'Jane',
}
// Wrong property type
var _person3 = {
	firstName : 'John',
	lastName : 'Wick',
	getFullName : 'Should be a function'
}

describe('API', () => {

	it('is able to test whether an object implements an Interface instance', ()=>{
		expect(Interface.implements(_person1,personInterface)).toBe(true);
		expect(Interface.implements(_person2,personInterface)).toBe(false);
	});

})