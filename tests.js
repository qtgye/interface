var personInterface = new Interface('PersonInterface', {
	firstName : 'string',
	lastName : 'string',
	getFullName : 'function'
});

var person = {
	firstName : 'Jace',
	lastName : 'Buquia',
	getFullName : function (){
		return this.firstName + ' ' + this.lastName;
	}
};

var person2 = {
	firstName : 'Jazz',
	lastName : 123
};

console.log('personInterface.isImplementedBy(person2)',personInterface.isImplementedBy(person2));
console.log('personInterface.testPropertiesOf(person2)',personInterface.testPropertiesOf(person2));


// TEST WITH CUSTOM OBJECT TYPES
var MyCustomType = function() {
	this.type = 'custom';
}

var placeInterface = new Interface('PlaceInterface', {
	name : 'string',
	longitud : 'number',
	latitude : 'number',
	type : MyCustomType
});

var manila = {
	name : 'Manila',
	longitud : 1,
	latitude : 2,
	type : new MyCustomType()
}

console.log('Using custom type as property',placeInterface.isImplementedBy(manila));


// TEST WITH DEFAULT VALUES
var carInterface = new Interface('CarInterface', {
	brand : ['string','Toyota']
});

var car = {
	brand : 'Honda'
};

console.log('carInterface.isImplementedBy(car)',carInterface.isImplementedBy(car));

var CarConstructor = function (brand) {
	this.brand = brand;
};
console.log('carInterface implemented on CarConstructor.prototype',carInterface.implementOn(CarConstructor).prototype);
console.log('carInterface implemented on an object',carInterface.implementOn({ owner : 'none'}));



var planetInterface = new Interface('PlanetInterface', {
	system : ['string','Solar'],
	name : 'string'
});

var PlanetConstructor = planetInterface.implementOn(function(name,system){
	this.name = name;
	this.system = system || this.system;
});

console.log('planetInterface.isImplementedBy(PlanetConstructor)',planetInterface.isImplementedBy(PlanetConstructor));
console.log('new planet',new PlanetConstructor('Earth'));
console.log('new planet',new PlanetConstructor('Kepler123','Kepler'));



// TEST ON OPTIONS
var articleOptionsInterface = new Interface('ArticleOptions', {
	title : 'string',
	subtitle : 'string',
	ID : 'number'
});

var Article = function(options){

	if ( !articleOptionsInterface.isImplementedBy(options) ) throw new Error('Article options must implement ArticleOptions interface');

	this.title = options.title;
	this.subtitle = options.subtitle;
	this.ID = options.ID;

}


console.log('testProperties of options',articleOptionsInterface.testPropertiesOf({ title : 'Article 01', subtitle : 'An awesome article', ID : 1 }));
console.log('passing instantiation',new Article({ title : 'Article 01', subtitle : 'An awesome article', ID : 1 }));

try {
	var _article = new Article({ title : 'Article 01', subtitle : 'An awesome article' });
} catch (e) {
	console.log('failing instantiation', e);
}



var phoneOptionsInterface = new Interface('PhoneOptionsInterface', {
	brand : ['string','Nokia'],
	year : ['number',new Date().getFullYear()],
});

var Phone = function(options){
	phoneOptionsInterface.testAndThrow(options);
	this.brand = options.brand;
	this.year = options.year;
}

var AndroidPhone = function(options){
	phoneOptionsInterface.testAndThrow(options)
}

var SamsungPhone = function(options) {
	phoneOptionsInterface.testAndReport(options, 'Must adhere to the phone options interface', TypeError)
}

try {
	var _article = new Phone({ brand : 'Samsung' });
} catch (e) {
	console.log('failing instantiation with throw',e.message)
}

try {
	var _article = new AndroidPhone({ brand : 'Samsung' });
} catch (e) {
	console.log('failing instantiation with custom throw',e)
}

try {
	var _article = new SamsungPhone({ brand : 'Samsung' });
} catch (e) {
	console.log('failing instantiation with report and custom throw',e)
}


// Using Interface-type as property

// var phoneInterface = new Interface('PhoneInterface',{
// 	system : ['string','Android'],
// 	brand : ['string','Samsung']
// });

var gadgetInterface = new Interface('GadgetInterface',{
	type : ['string','phone'],
	data : new Interface('PhoneInterface',{
				system : ['string','Android'],
				brand : ['string','Samsung']
			})
});

function Gadget (gadgetOptions) {
	gadgetInterface.testAndReport(gadgetOptions);
}

var phone = { system : 'IOS' };
var gadget = { type : 'phone', data : phone };

try {
	var _newGadget = new Gadget(gadget);
} catch (e) {
	console.log('Failed instantiation using interface-type property',e);
}


// STATICS
var student = {
	name : 'Jace',
	surname : 'Buquia'
};

var studentInterface = new Interface('StudentInterface', {
	name : 'string',
	surname : 'string'
})

console.log('Static method: "implements"',Interface.implements(student,studentInterface));