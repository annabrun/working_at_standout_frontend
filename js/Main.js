/*
* Main är en statisk klass.
* Main körs när sidan laddas in.
*/
var Main = {
/*
* Globala variabler.
*/
	map : null,

	DEFAULT_LOCATION_LAT : 56.8556997,
	DEFAULT_LOCATION_LNG : 14.8290924,

/*
* Funktionen startas när Main körs.
*/
	init : function() {	
		
		Main.initMap();
		Main.getLocations();
		Main.addSupplier();
		Main.searchSupplier();

	},
/*
* Funktionen skapar huvudkartan
* Zoomen på kartan ska ligga på 6.
* Kartan ska vara en Roadmap.
* Kartan ska ligga i map-id't.
*/	
	initMap : function() {

		var canvas				= document.getElementById('map');
		var options 			= new Object();
			options.zoom		= 5;
			options.mapTypeId	= google.maps.MapTypeId.ROADMAP;
			
		Main.map = new google.maps.Map(canvas, options);
		
	},
/*
* Funktionen skapar en ny instans av Ajax.
* Ajax går in i GetPosts och startar onDataLoaded.
*/
	getLocations : function() {	
		
		var ajax = new Ajax();
		ajax.get("http://localhost:3000/suppliers", Main.placeMarkers);

	},
/*
* Funktionen tar emot responseData.
* responseData görs om till en text.
* Om responseData är tom ska defaultLocationFunction startas.
* Om responseData har värden loopas alla inlägg igenom och får en variabel.
* Bilden läggs in i en img-tagg.
* addDataToStage startas och skickar med lat och lng
* En ny instans av Marker skapas och skickar med alla värden. 
*/
	placeMarkers : function(responseData) {	

		responseData = responseData.responseText;

		if (!!responseData) {

			responseData = JSON.parse(responseData);

			Main.addDataToStage(Main.DEFAULT_LOCATION_LAT, Main.DEFAULT_LOCATION_LNG);

			for (var i = 0; i < responseData.length; i++) {

				var id  		= responseData[i].id;
	            var name   		= responseData[i].name;
				var address  	= responseData[i].address;
	            var postcode    = responseData[i].postcode;
	            var city     	= responseData[i].city;
	            var phone		= responseData[i].phone;
	            var email		= responseData[i].email;
	            var category	= responseData[i].category;
	            var lat			= responseData[i].latitude;
	            var lng			= responseData[i].longitude;

				var theMarker = new Marker(id, name, address, postcode, city, phone, email, category, lat, lng);
			}

			
				
		} else {

			Main.defaultLocationFunction();
		}
	},
/*
* Funktionen tar emot lat och lng.
* En ny LatLng skapas med värderna av lat och lng.
* Kartan ska visa cental punkten av det sista blogginlägget.
*/
	addDataToStage : function(lat, lng) {
		
		var location = new google.maps.LatLng(lat, lng);
		Main.map.setCenter(location);
	},
/*
* Funktionen skapar en ny LatLng med defaultvärderna.
* Kartan ska visa cental punkten av defaultvärderna.
*/
	defaultLocationFunction : function() {

		var defaultLocation = new google.maps.LatLng(Main.DEFAULT_LOCATION_LAT, Main.DEFAULT_LOCATION_LNG);
			Main.map.setCenter(defaultLocation);
	}, 

	addSupplier : function() {

		document.getElementById('add-form').onsubmit=function() {

			var name = document.forms["add-form"]["name"].value;
			var street = document.forms["add-form"]["address"].value;
			var postcode = document.forms["add-form"]["postcode"].value;
			var city = document.forms["add-form"]["city"].value;
			var phone = document.forms["add-form"]["phone"].value;
			var email = document.forms["add-form"]["email"].value;
			var category = document.forms["add-form"]["category"].value;

			var address = street + ", " + postcode + ", " + city; 
			var geocoder = new google.maps.Geocoder();
			geocoder.geocode({'address': address}, function(results, status) {
	          if (status === 'OK') {
	            var latitude = results[0].geometry.location.lat();
                var longitude = results[0].geometry.location.lng();

                var data = JSON.stringify({	"name" : name , 
                    						"address" : street ,
                    						"postcode" : postcode , 
											"city" : city , 
											"phone" : phone , 
											"email" : email , 
											"category" : category , 
											"latitude" : latitude , 
											"longitude" : longitude 
								});

                alert(data);

                var ajax = new Ajax();
				ajax.post("http://localhost:3000/suppliers", data, Main.addSupplierDone);
	           
	            
	          } else {
	            alert('Geocode was not successful for the following reason: ' + status);
	          }
	        });
			/*geocoder.geocode({ 'address': address }, function (results, status) {

			
                if (status == google.maps.GeocoderStatus.OK) {
                    var latitude = results[0].geometry.location.lat();
                    var longitude = results[0].geometry.location.lng();

                    alert("Latitude: " + latitude + "\nLongitude: " + longitude);

                    console.log(latitude + " " + longitude);*/
                   /* */



					//

            /*        alert("Latitude: " + latitude + "\nLongitude: " + longitude);
                } else {
                    alert("Request failed.")
                }
            });*/

            

			return false;

		  }

	

	},

	addSupplierDone : function() {

		//Empty response-function
		alert("add request done");
	},
	
	searchSupplier : function() {

		document.getElementById('get-suppliers-form').onsubmit=function() {

			var category = document.forms["get-suppliers-form"]["category"].value;

			alert(category);

		  } 

	},

	
    
}//End Class 
/**
 *	När Main laddas in ska init-funktionen skapas. 
 */
google.maps.event.addDomListener(window, 'load', Main.init); // NOTE THIS NEW EVENT LISTENER FROM GOOGLE