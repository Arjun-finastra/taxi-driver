// JavaScript Document

var myVariable = '';
var currentLat;
var currentLng;
var roadName;
$(document).ready(function() {

	currentUser = getLocalStorage("User");

	params = {
		callback : 'callbackGetDriverid',
		controller : 'Drivers',
		action : 'getDriverid',
		data : [{
			userId : currentUser.id
		}]
	};
	getAjaxData(params, 'callbackGetDriverid');

	params = {
		callback : 'callbackNotification',
		controller : 'Notifications',
		action : 'notification',
		data : [{
			driverId : localStorage.getItem("driverid")
		}]
	};
	getAjaxData(params, 'callbackNotification');

	$("body").on('click', "input[type=checkbox][name=onoffswitch]", function() {
		//alert('clicked');
		if ($('input[type=checkbox][name=onoffswitch]').is(':checked')) {
			makeChange = 0;
		} else {
			makeChange = 1;
		}
		//makeChange = 1;
		params = {
			callback : 'callbackChangeDuty',
			controller : 'Drivers',
			action : 'changeOnduty',
			data : [{
				changeStatus : makeChange,
				driverId : localStorage.getItem("driverid")
			}]
		};
		getAjaxData(params, 'callbackChangeDuty');
	});

	$('#goOffline').click(function(e) {
		params = {
			callback : 'callbackGoOffline',
			controller : 'Drivers',
			action : 'goOffline',
			data : [{
				driverId : localStorage.getItem("driverid")
			}]
		};
		getAjaxData(params, 'callbackGoOffline');
	});

	$('#goOnrest').click(function(e) {
		params = {
			callback : 'callbackGoOnrest',
			controller : 'Drivers',
			action : 'goOnrest',
			data : [{
				driverId : localStorage.getItem("driverid")
			}]
		};
		getAjaxData(params, 'callbackGoOnrest');
	});

	$('#goUnrest').click(function(e) {
		params = {
			callback : 'callbackGoUnrest',
			controller : 'Drivers',
			action : 'goUnrest',
			data : [{
				driverId : localStorage.getItem("driverid")
			}]
		};
		getAjaxData(params, 'callbackGoUnrest');
	});

	/*$('.JobStatus').click(function(e) {
	 clearTimeout(timer);
	 var myId = this.id;

	 if(myId == 'acceptJob'){
	 $("#acceptJob").hide();
	 $("#rejectJob").hide();
	 $("#arrivedJob").show();
	 calculateDistances(job.from_detail,job.to_detail);

	 params = { callback : 'callbackJobAccepted', controller : 'Jobs', action : 'jobAccepted', data : [{ driverId : localStorage.getItem('driverid'), jobId : jobId.id, dDistance: localStorage.getItem('driverDistance'), dTime:localStorage.getItem('arrivalDuration') }] };
	 getAjaxData(params, 'callbackJobAccepted');
	 }
	 });*/

	$('.JobStatus').click(function(e) {
		clearTimeout(window.timer);
		var myId = this.id;
		if (myId == 'acceptJob') {
			$("#acceptJob").hide();
			$("#rejectJob").hide();
			$("#arrivedJob").show();
			$("#navigateJob").show();
			/* calculateDistances(job.from_detail,job.to_detail); */

			params = {
				callback : 'callbackJobAccepted',
				controller : 'Jobs',
				action : 'jobAccepted',
				data : [{
					driverId : localStorage.getItem('driverid'),
					jobId : jobId.id,
					dDistance : localStorage.getItem('driverDistance'),
					dTime : localStorage.getItem('arrivalDuration')
				}]
			};
			getAjaxData(params, 'callbackJobAccepted');
		} else if (myId == 'rejectJob') {
			//alert('pppppppp');
		}
	});

	$('#arrivedJob').click(function(e) {
		$("#arrivedJob").hide();
		$("#navigateJob").hide();
		$("#pickedJob").show();
		params = {
			callback : 'callbackDriverArrived',
			controller : 'Jobs',
			action : 'driverArrived',
			data : [{
				driverId : localStorage.getItem('driverid'),
				jobId : jobId.id
			}]
		};
		getAjaxData(params, 'callbackDriverArrived');
	});

	$('#navigateJob').click(function(e) {
		geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + window.currentLat + ',' + window.currentLng + '&sensor=true';

		$.getJSON(geocodeUrl, function(result) {
			window.roadName = result.results[0].formatted_address;
			console.log(window.roadName);
			navigator.google_navigate.navigate(window.roadName, function() {
				console.log('Success');
			}, function(errMsg) {
				console.log("Failed: " + errMsg);
			});
		});

	});

	$('#pickedJob').click(function(e) {
		//$("#arrivedJob").hide();
		$("#pickedJob").hide();
		$("#navigateJob").hide();
		$("#completeJob").show();
		params = {
			callback : 'callbackDriverPicked',
			controller : 'Jobs',
			action : 'driverPicked',
			data : [{
				driverId : localStorage.getItem('driverid'),
				jobId : jobId.id
			}]
		};
		getAjaxData(params, 'callbackDriverPicked');
	});

	$('#completeJob').click(function(e) {
		//$("#arrivedJob").hide();
		//$("#pickedJob").hide();
		$("#completeJob").show();
		$("#navigateJob").hide();
		params = {
			callback : 'callbackJobCompleted',
			controller : 'Jobs',
			action : 'jobCompleted',
			data : [{
				driverId : localStorage.getItem('driverid'),
				jobId : jobId.id
			}]
		};
		getAjaxData(params, 'callbackJobCompleted');
	});

	//if(jobId.id == JobPostNo && jobId.status > 0 ) alert('Job accepted already');
});

//			=== >         This change happens to database job table
// Job Status if rejected then 							status == 0
// Job Status if accepted then 							status == 1
// Job Status if arrived to client place then 			status == 2
// Job Status if picked up the client  then 			status == 3
// Job Status if dropped the client then 				status == 5

function callbackIsOnduty(data) {
	userCounting = 0;
	driverCounting = 0;
	if (data.success == true) {
		$.each(data.data, function(key, value) {
			$.each(value, function(keyUP, valueUP) {
				if (keyUP == 'User' && userCounting == 0) {
					$('#username').append(valueUP.username);
					userCounting++;
				}

				if (keyUP == 'Driver' && driverCounting == 0) {
					if (valueUP.is_onduty == '0') {
						$('#dutyStatus').append(' is offline');
						$(".onoffswitch").css("display", "block");
						//$(".onButton").css("display", "inline-block");
						$(".offonState").css("display", "none");
						$('#activeVehicleInfo').css("display", "block");
						window.variable = 8;
					} else if (valueUP.is_onduty == '1') {
						//$('input[type=checkbox][name=onoffswitch]').prop('checked', true); .onoffswitch
						$(".offonState").css("display", "block");
						$('#dutyStatus').append(' is on duty. ' + '<span class="green_circle"></span>');
						$('#goOnrest').css("display", "block");
						$('#goUnrest').css("display", "none");
						window.variable = 9;
					} else if (valueUP.is_onduty == '2') {
						window.variable = 7;
						$('#goUnrest').css("display", "block");
						$('#goOnrest').css("display", "none");
						$('#dutyStatus').append(' is on rest.' + '<span class="yellow_circle"></span>');
					}
					driverCounting++;
				}

				if (keyUP == 'DriverVehicle') {
					$.each(valueUP, function(keyDN, valueDN) {
						if (keyDN == 'is_current' && valueDN == 1) {
							$('#activeVehicleInfo').append('Current Vehicle ' + value['Vehicle']['registration_no']);
						} else if (keyDN == 'is_current' && valueDN == 0) {

						}
					});
				}

			});
		});
	} else {

	}
}

function callbackChangeDuty(data) {
	if (data.success == true) {
		//console.log(data);
		document.addEventListener('deviceready', onDeviceReady, true);
		window.location.reload();
	} else {

	}
}

function callbackGoOffline(data) {
	if (data.success == true) {
		window.location.reload();
	} else {

	}
}

function callbackGoOnrest(data) {
	if (data.success == true) {
		window.location.reload();
	} else {

	}
}

function callbackGoUnrest(data) {
	if (data.success == true) {
		window.location.reload();
	} else {

	}
}

function callbackNotification(data) {
	if (data.success == true && data.data != "emptyData") {
		//if (data.data.Job.options ) {
		console.log(data.data);
		setLocalStorage('job', JSON.parse(data.data.Job.options));
		job = getLocalStorage('job');
		setLocalStorage('jobId', data.data.Job);
		jobId = getLocalStorage('jobId');
		setLocalStorage('JobPostNo', jobId.id);
		//calculateDistances(job.from_detail,job.to_detail);
		if (getLocalStorage("acceptanceStatus") == 10 && jobId.status != 5) {
			$('#notification').append('<div class="message warning"><p><a href="#popupBasic" data-rel="popup" data-transition="pop" id="popupLink" data-icon="ok" data-iconpos="left" data-role="button" data-inline="true">New Job, Job id ' + data.data.Notification.job_id + '</a> <br>From:  <span id="from_address_out"></span> <br>To: <span id="to_address_out"></span><br>Distance:' + localStorage.getItem('driverDistance') + '<br>RATE : <span id="rate_amount_out"><span></p></div>');
			//$('#popupBasic').popup('open');
		} else if (getLocalStorage("acceptanceStatus") == 15 && jobId.status != 5) {
			$('#notification').append('<div class="message warning"><p><a href="#popupBasic" data-rel="popup" data-transition="pop" id="popupLink" data-icon="ok" data-iconpos="left" data-role="button" data-inline="true">New Job, Job id ' + data.data.Notification.job_id + '</a> <br>From:  <span id="from_address_out"></span> <br>To: <span id="to_address_out"></span><br>Distance:' + localStorage.getItem('driverDistance') + '<br>RATE : <span id="rate_amount_out"><span></p></div>');
			//$('#notification').append('<div class="message success"><p>You just completed a job</p></div>');
			//$('#popupBasic').popup('open');
		}

		$('#from_address_out').text(job.from_detail);
		$('#to_address_out').text(job.to_detail);
		$('#from_address_out1').text(job.from_detail);
		$('#to_address_out1').text(job.to_detail);
		$('#rate_amount_out').text(data.data.Job.customer_offer);
		$('#rate_amount_out1').text(data.data.Job.customer_offer);
		$('#vehichle_type_out').text(job.vehicle_type);
		$('#taxi_type_out').text(job.taxi_type);
		$('#baby_seat_out').text(job.baby_seat);
		$('#wheel_chair_out').text(job.wheel_chair);

		window.currentLat = job.current_lat;
		window.currentLng = job.current_lng;
		//console.log(job.latitude+"=>"+job.longitude);
		$(".joboffer").css({
			height : $(window).height(),
			width : $(window).width()
		});
		if (getLocalStorage("acceptanceStatus") > 10 && getLocalStorage("acceptanceStatus") < 15) {
			if (getLocalStorage("acceptanceStatus") == 11) {
				$("#acceptJob").hide();
				$("#rejectJob").hide();
				$("#arrivedJob").show();
				$("#navigateJob").show();
				$('#popupBasic').popup('open');
			} else if (getLocalStorage("acceptanceStatus") == 12) {
				$("#acceptJob").hide();
				$("#navigateJob").hide();
				$("#rejectJob").hide();
				$("#pickedJob").show();
				$('#popupBasic').popup('open');
			} else if (getLocalStorage("acceptanceStatus") == 13) {
				$("#acceptJob").hide();
				$("#navigateJob").hide();
				$("#rejectJob").hide();
				$("#completeJob").show();
				$('#popupBasic').popup('open');
			} else if (getLocalStorage("acceptanceStatus") == 15) {
				$("#acceptJob").hide();
				$("#rejectJob").hide();
				$("#completeJob").hide();
				$("#navigateJob").hide();
				//$('#popupBasic').popup('open');

			}

		}

		//$(".joboffer").css({ height: $(window).height(),  width: $(window).width()});
	} else {

	}
}

function callbackGetDriverid(data) {
	if (data.success == true) {
		//window.location.reload();
		//response.setIntHeader("Refresh", 1);
		localStorage.driverid = data.data.Driver.id;
		myVariable = data.data.Driver.id;

		params = {
			callback : 'callbackIsOnduty',
			controller : 'Drivers',
			action : 'isOnduty',
			data : [{
				driverId : data.data.Driver.id
			}]
		};
		getAjaxData(params, 'callbackIsOnduty');
	} else {

	}
}

// Local storage job acceptance status

// If Not accepted yet then				acceptanceStatus = 10;
// If Job is accepted by Driver then 	acceptanceStatus = 11;
// If Driver arrived to client 			acceptanceStatus = 12;
// If Driver picked the client			acceptanceStatus = 13;
// If Driver completed the job 			acceptanceStatus = 15;

function callbackJobAccepted(data) {
	if (data.success == true) {
		setLocalStorage('acceptanceStatus', 11);

	} else {

	}
}

function callbackDriverArrived(data) {
	if (data.success == true) {
		setLocalStorage('acceptanceStatus', 12);
		//window.location.href = "dashboard.html";
		//window.location.reload();
	} else {
	}
}

function callbackDriverPicked(data) {
	if (data.success == true) {
		setLocalStorage('acceptanceStatus', 13);
		//window.location.href = "dashboard.html";
		//window.location.reload();
	} else {
	}
}

function callbackJobCompleted(data) {
	if (data.success == true) {
		setLocalStorage('acceptanceStatus', 15);
		$('#popupBasic').popup('close');
		//setLocalStorage('acceptanceStatus',10);
		//window.location.reload();
		//urlString = "dashboard.html";
		//window.open(urlString);
		window.location.href = "dashboard.html";

	} else {
	}
}

function calculateDistances(f, t) {
	var service = new google.maps.DistanceMatrixService();
	service.getDistanceMatrix({
		origins : [f],
		destinations : [t],
		travelMode : google.maps.TravelMode.DRIVING,
		unitSystem : google.maps.UnitSystem.METRIC,
		avoidHighways : false,
		avoidTolls : false
	}, callback);
}

function callback(response, status) {
	if (status != google.maps.DistanceMatrixStatus.OK) {
		alert('Error was: ' + status);
	} else {
		console.log(response.rows[0].elements[0].distance.text);
		console.log(response.rows[0].elements[0].duration.text);
		setLocalStorage('driverDistance', response.rows[0].elements[0].distance.text);
		setLocalStorage('arrivalDuration', response.rows[0].elements[0].duration.text);
	}
}

function callbackSendMail(data) {

}