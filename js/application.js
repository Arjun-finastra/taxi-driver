//create map
var map,
	currentPositionMarker,
	mapCenter = new google.maps.LatLng(40.700683, -73.925972),
	map;

function initializeMap()
{
	map = new google.maps.Map(document.getElementById('map-canvas'), {
	   zoom: 13,
	   center: mapCenter,
	   mapTypeId: google.maps.MapTypeId.ROADMAP
	 });
}

function locError(error) {
	// the current position could not be located
	alert("The current position could not be found!");
}

function setCurrentPosition(pos) {
	currentPositionMarker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(
			pos.coords.latitude,
			pos.coords.longitude
		),
		title: "Current Position"
	});
	map.panTo(new google.maps.LatLng(
			pos.coords.latitude,
			pos.coords.longitude
		));
}

function displayAndWatch(position) {
	// set current position
	setCurrentPosition(position);
	// watch position
	watchCurrentPosition();
}

function watchCurrentPosition() {
	var options = {timeout: 5000};
	var positionTimer = navigator.geolocation.watchPosition(
		function (position) {
			setMarkerPosition(
				currentPositionMarker,
				position
			);
		}, function () {
			alert('cannot update position');
		}, options);
}

function setMarkerPosition(marker, position) {
	marker.setPosition(
		new google.maps.LatLng(
			position.coords.latitude,
			position.coords.longitude)
	);
}

function initLocationProcedure() {
	initializeMap();
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(displayAndWatch, locError);
	} else {
		alert("Your browser does not support the Geolocation API");
	}
}

$(document).ready(function() {
	initLocationProcedure();
});
