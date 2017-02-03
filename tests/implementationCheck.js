var Interface = require('../src/interface.js')
var personInterface = new Interface('PersonInterface', {
	firstName : 'string',
	lastName : 'string',
	getFullName : 'function'	
});
// Interface with all the native types
var laptopInterface = new Interface('LaptopInterface', {
	brand : 'string',
	price : 'number',
	isTouch : 'boolean',
	apps : 'array',
	specs : 'object',
	powerOn : 'function'
});
// Valid implementation
var _person1 = {
	firstName : 'John',
	lastName : 'Doe',
	getFullName : function () {
		return this.firstName + ' ' + this.lastName
	}
};
// Native JS types
var _macbook = {
	brand : 'MacBook',
	price : 60000,
	isTouch : false,
	apps : ['Finder','Terminal'],
	specs : { display : 'retina', touchBar : false },
	powerOn : function(){this.power='on'}
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

describe('Implementation Checking Behavior', () => {

	it('checks against native types in Javascript', ()=>{
		expect(laptopInterface.isImplementedBy(_macbook)).toBe(true);
	});

})