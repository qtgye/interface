'use strict'

;(function(){
	
	// Interface Class
	var Interface = function (name, properties) {

		/* Contains default types in Javascript */
		var defaultTypes = [ 'string', 'boolean', 'number', 'array', 'object', 'function', 'null', 'undefined' ]

		// Interface must have a name
		if ( typeof name !== 'string' ) {
			throw new TypeError('Interface instance requires a name')
		}

		// 	Properties must be a set of object properties
		if ( typeof properties !== 'object' ) {
			throw new TypeError('Interface instance requires a set of object properties')
		}

		// 	Public properties
		Object.defineProperties(this, {
			name : {
				value : name
			},
			properties : {
				value : [] // An array of objects declaring property name and type { name : 'prop1', 'type' : 'number' }
			}
		})

		for ( var key in properties ) {
			this.properties.push((function(){

				var propertyObject = {}
				var arrayOrTypeString = properties[key]
				var type = Array.isArray(arrayOrTypeString) ? arrayOrTypeString[0] : arrayOrTypeString
				var defaultValue = Array.isArray(arrayOrTypeString) ? arrayOrTypeString[1] : 
					type === 'boolean' ? true :
					type === 'string' ? '' :
					type === 'number' ? 0 :
					type === 'array' ? [] :
					type === 'object' ? {} :
					type === 'function' ? function(){} :
					type === 'null' ? null :
					undefined

				// Check if type is a valid (either included in defaultTypes or a function constructor)
				if ( defaultTypes.indexOf(type) < 0 && typeof type !== 'function' ) {
					throw new Error('Invalid type for an interface property.')
				}

				propertyObject.name = key
				propertyObject.type = type
				propertyObject.default = defaultValue
				propertyObject.testOnObject = function (object){

						var testReport = { success : true }
						
						if ( !(propertyObject.name in object) ) {
							testReport.success = false
							testReport.errorType = 'ReferenceError'
							testReport.errorMessage = 'Property "'+propertyObject.name+'" is not a member.'
							return testReport
						}

						// Test property type from default types
						if ( defaultTypes.indexOf(propertyObject.type) > -1 ) {

							if ( 
								(propertyObject.type === 'null' && object[propertyObject.name] !== null) ||
								(propertyObject.type === 'array' && !Array.isArray(object[propertyObject.name])) ||
								(!propertyObject.type.match(/^(null|array)$/) && typeof object[propertyObject.name] !== propertyObject.type )
							) {
								testReport.success = false
								testReport.errorType = 'TypeError'
								testReport.errorMessage = 'Property "'+propertyObject.name+'" has wrong type.'
							}

						// Test agains an Interface type
						} else if ( propertyObject.type instanceof Interface  ) {
							var report = propertyObject.type.testPropertiesOf(object[propertyObject.name])
							if ( !report.isImplemented ) {
								testReport.success = false
								testReport.errorType = 'TypeError'
								testReport.errorMessage = 'Property "'+propertyObject.name+'" must implement ' + propertyObject.type.name + ' interface'
								report.errors.forEach(function(error){
									console.error(error.message)
								})
							}

						// Test property type as an instance of the given type
						} else if ( !(object[propertyObject.name] instanceof propertyObject.type) ) {
							testReport.success = false
							testReport.errorType = 'TypeError'
							testReport.errorMessage = 'Property "'+propertyObject.name+'" has wrong type.'
						}
						
						return testReport
					}

				return propertyObject

			}.bind(this)()))
		}

	}


	// Interface Prototype properties
	Object.defineProperties(Interface.prototype, {

		/**
		 * Attaches interface properties on a constructor prototype
		 * @param {function} constructor - Object|Function|Class
		 * @return {function} the constructor with implemented interface
		*/
		implementOn : {
			value : function (constructor) {

				if ( typeof constructor !== 'function' &&  typeof constructor !== 'object' ) {
					throw new TypeError('Interface must only be implemented on an object, class, or function constructor')
				}

				var object = (typeof constructor === 'function') ? constructor.prototype : constructor

				this.properties.forEach(function(property){
					object[property.name] = property.default
				})
				return constructor
			}
		},


		/* Tests whether a given object implements this interface */
		isImplementedBy : {
			value : function (objectOrConstrutor) {

				var object = (typeof objectOrConstrutor === 'function') ? objectOrConstrutor.prototype : objectOrConstrutor

				if ( typeof object !== 'object' ) {
					throw new TypeError('Cannot test interface implementation against a non-object or non-constructor type.')
				}

				// Test each interface property against each object property
				return this.properties.every(function(property){
						var propTestReport = property.testOnObject(object)
						if ( !propTestReport.success ) return false
						return true
				}.bind(this))

			}
		},


		testAndThrow : {
			value : function( object, errorMessage, errorType ) {
				if ( !this.isImplementedBy(object) ) {
					var type = errorType || Error
					throw new type(errorMessage || 'Tested object does not implement ' + this.name + ' interface.')
				}
			}
		},
		
		/**
		 * Performs reflection on the Interface testing each property against an object
		 * @param {object} object - The object to which this interface is tested against
		 * @return {object} - A report about the test. Contains errors if there are any
		*/
		testAndGetReport : {
			value : function (object) {
				
				if ( typeof object !== 'object' ) {
					throw new TypeError('Cannot test interface properties against a non-object.')
				}
				
				var report = {
					isImplemented : true,
					errors : [],
				}
				
				// If this interface is not implemented, generate a message for each property with error
				this.properties.forEach(function( property ){
					var testReport = property.testOnObject(object)
					if ( !testReport.success ) {
						report.isImplemented  = false
						report.errors.push({
							property : property.name,
							message : testReport.errorMessage
						})
					}
				}.bind(this))

				return report

			}
		}

	})


	// static methods
	Object.defineProperties(Interface, {

		/* Tests whether an object implements an Interface instance */
		implements : {
			value : function (object, interfaceInstance) {
				
				// Check second argument
				if ( typeof object !== 'object' ) {
					throw new TypeError('First argument must be an object')
				}
				
				// Check first argument
				if ( !(interfaceInstance instanceof Interface) ) {
					throw new TypeError('Second argument must be an Interface type.')
				}

				// Test implementation
				return interfaceInstance.isImplementedBy(object)

			}
		}
	})


	// Allow to be used in node and browser
	if ( typeof module !== 'undefined' ) {
		module.exports = Interface
	} else {
		window.Interface = Interface
	}


})()