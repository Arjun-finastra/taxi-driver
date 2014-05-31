// JavaScript Document

currentUser = getLocalStorage("User");
driver = currentUser.id;

$(document).ready(function() {
	params = {
		callback : 'callbackVehicleList',
		controller : 'Vehicles',
		action : 'vehicleList',
		data : [{
			userId : driver
		}]
	};
	getAjaxData(params, 'callbackVehicleList');

	$("body").on("click", "label", function() {
		clickedId = $(this).prev('input[type="radio"]').attr('value');
		checkedId = $(this).parents('form').find('.checkedInput').attr('for');
		//alert(clickedId);
		//console.log(checkedId);
		//return false;
		params = {
			callback : 'callbackMakeVehicleCurrent',
			controller : 'DriversVehicles',
			action : 'makeVehicleCurrent',
			data : [{
				currentId : clickedId,
				previousId : checkedId
			}]
		};
		getAjaxData(params, 'callbackMakeVehicleCurrent');
	});

	//navigator.geolocation.getCurrentPosition(onSuccess_current, onError);
});

function callbackVehicleList(data) {
	if (data.success == true) {
		$.each(data.data, function(key, value) {
			$.each(data.data[key], function(key, value) {
				if (key == 'Vehicle') {
					var _html = '<div class="input-container clearfix">';
					_html += '<input type="radio" name="vehicleActive" class="radio" value="' + value.id + '" data-role="none"/>';
					_html += '<label for="' + value.id + '">' + key + ':' + value.registration_no + '</label><div class="clearfix">';
					_html += '</div></div>';
					$('#my-vehicle-list form').append(_html);
				}
			})
		});
		checkDriversActiveVehicle();
	}
}

function checkDriversActiveVehicle() {
	params = {
		callback : 'callbackActiveVehicle',
		controller : 'DriversVehicles',
		action : 'checkVehicleisCurrent',
		data : [{
			userId : driver
		}]
	};
	getAjaxData(params, 'callbackActiveVehicle');
}

function callbackActiveVehicle(data) {
	if (data.success == true) {
		$.each(data.data, function(key, value) {
			checkedId = value['DriversVehicle']['id'];
			//alert(checkedId);
			$('input:radio[name=vehicleActive][value=' + checkedId + ']').prop('checked', true);
			$("label").removeClass('checkedInput').addClass('uncheckedInput');
			$("label[for='" + checkedId + "']").removeClass('uncheckedInput').addClass('checkedInput');
		})
	}
}

function callbackMakeVehicleCurrent(data) {
	if (data.success == true) {
		//alert("vehicle change success");
		try {
			navigator.geolocation.getCurrentPosition(onSuccess, onError);
		} catch (e) {
			alert(e.message);
		}
		//window.location.href = "dashboard.html";
	}
}

function onSuccess(position) {
	alert("update success");
	params = {
		callback : 'callbackUpdateLocation',
		controller : 'DriversVehicles',
		action : 'updateLocation',
		data : [{
			latitude : position.coords.latitude,
			longitude : position.coords.longitude,
			driverId : localStorage.getItem("driverid")
		}]
	};
	getAjaxData(params, 'callbackUpdateLocation');
}

function onError(error) {
	alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

function callbackUpdateLocation(data) {
	if (data.success == true) {
		window.location.href = "dashboard.html";
	}
}	