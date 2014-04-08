// JavaScript Document
var serviceURL		= "http://dev.smart-catalog.com.au/uk/taxi-app/services/";
/**
 * Setting var value as per Dev enviornment
 */
var	loc = window.location.toString();
if(loc.search("taxi-customer") != -1 || loc.search("taxi-driver") != -1){
	//serviceURL = "http://taxi-app.dev/services/"; // For configured dev sites
} else if(loc.search("/localhost/") != -1) {
	//serviceURL = "http://localhost/projects/uk/taxi-app/services/"; // For localhost
}

var pageTitle		= '';
var nonSecurePages	= ["index.html","forgot-password.html","register.html"];

var User = null;
	$(document).bind("mobileinit", function(){
		$.extend(  $.mobile , {
			ajaxEnabled: true,
			allowCrossDomainPages: true,
			phonegapNavigationEnabled: true
		});
		//$(function(){ $('input').attr('autocomplete', 'off'); });
		$(function(){ $('[data-role=header],[data-role=footer]').fixedtoolbar({ tapToggle:false }); });
      });



/* Set login State*/
function setLoginState(data) {
	setLocalStorage("loggedin", "yes");
	setLocalStorage("User", data.data);
	getLoginState();
}
/* Get login State */
function getLoginState() {
	var loggedIn = getLocalStorage("loggedin");
	if(loggedIn == 'yes') {
		User = getLocalStorage("User");
	}
}
/* Delete Login state - Logout */
function logout() {
	clearLocalStorage();
	User = null;
	location.replace('index.html');
}
/**
 * Method to check secure access to the pages
 */
function allowAccess()
{
	var sPath = window.location.pathname; 
	var sPage = sPath.substring(sPath.lastIndexOf('/') + 1); 
	filename = sPage.toLowerCase();
	User = getLocalStorage("User");
	if(!empty(User)) { 
		userToken = User.token;
		//console.log(userToken);
	} else {
		userToken = null;	
	}
	
	if($.inArray(filename, nonSecurePages) == -1 && empty(userToken)) {
		logout();
	} else if($.inArray(filename, nonSecurePages) !=-1 && !empty(userToken)) {
		if(filename != 'dashboard.html') location.replace('dashboard.html');
	} else {
		getLoginState();
	}
}
/*
 * Set user token in user token hidden field
 */
function setUserToken() {
	if($('#user-token').length > 0 && !empty(User)) {
		$('#user-token').val(User.token);
	}
}

/**
 * Wrapper of LocalStorage
 */
function setLocalStorage(fieldName, value) {
	window.localStorage.setItem(fieldName, JSON.stringify(value));	
}
function getLocalStorage(fieldName) {
	if(window.localStorage.getItem(fieldName) == null) {
		return null;
	}
	return JSON.parse(window.localStorage.getItem(fieldName));	
}
function removeLocalStorage(fieldName) {
	window.localStorage.removeItem(fieldName);
}
function clearLocalStorage() {
	window.localStorage.clear();		
}
/**
 * Wrapper of sessionStorage
 */
function setSessionStorage(fieldName, value) {
	window.sessionStorage.setItem(fieldName, JSON.stringify(value));	
}
function getSessionStorage(fieldName) {
	return JSON.parse(window.sessionStorage.getItem(fieldName));	
}
function removeSessionStorage(fieldName) {
	window.sessionStorage.removeItem(fieldName);
}
function clearSessionStorage() {
	window.sessionStorage.clear();		
}

/* Global submit with JSONP */

function submitForm(formObj) {

	//console.log($(formObj).serialize());
	
	callback	= $('input[name="callback"]', formObj).val();
	controller 	= $('input[name="controller"]', formObj).val();
	action		= $('input[name="action"]', formObj).val();
	$.ajax({
		//beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
		//complete: function() { $.mobile.hidePageLoadingMsg() }, //Hide spinner
		url: serviceURL + controller + '/' + action,
		crossDomain: true,
		cache: true,
		data: $(formObj).serialize(),
		dataType: "jsonp",
		jsonp : false,
		jsonpCallbackString: 'callback',
		jsonpCallback: callback,
		timeout: 60000,
		error: function(){
			errorDialog();
		}
	});
	$.mobile.silentScroll(0)
	return false;
}

/* Global AJAX Request with JSONP */

function getAjaxData(params, callback) {
	controller 	= params['controller'];
	action		= params['action'];
	ajaxData =  $.param(params); /*params.serialize();*/ 
	//alert(ajaxData);
	$.ajax({
		//beforeSend: function() { $.mobile.showPageLoadingMsg(); }, //Show spinner
		//complete: function() { $.mobile.hidePageLoadingMsg() }, //Hide spinner
		url: serviceURL + controller + '/' + action,
		crossDomain: true,
		cache: true,
		data: ajaxData,
		dataType: "jsonp",
		jsonp : false,
		jsonpCallbackString: 'callback',
		jsonpCallback: callback,
		timeout: 60000,
		error: function(){
			errorDialog();
		}
	});
	return false;
}

function errorDialog() {
	alertDialog("Error Loading Data", "Please try again later.");
}
/*   */
function showMessage(data) {
	setErrorMessages(data);
	if(!empty(data.message)) {
		$('#result').show();
		if(data.success == true) {
			$('#result').html(data.message);
			$('#result').removeClass('err');
			$('#result').addClass('success');
		} else {
			$('#result').html(data.message);
			$('#result').removeClass('success');
			$('#result').addClass('err');
		}
	}
}
function hideMessgae() {
	$('#result').hide();
}

/**
 * JavaScript Custom empty() methiod that works like PHP empty()
 */

function empty (mixed_var) {
  var undef, key, i, len;
  var emptyValues = [undef, null, false, 0, "", "0"];

  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixed_var === emptyValues[i]) {
      return true;
    }
  }

  if (typeof mixed_var === "object") {
    for (key in mixed_var) {
      // TODO: should we check for own properties only?
      //if (mixed_var.hasOwnProperty(key)) {
      return false;
      //}
    }
    return true;
  }

  return false;
}

/**
 * Autocomplete Data
 */
function loadAutocomplete(ctrl, source) {
	var src_keyword = $(ctrl).val();
	//var array = [ "Foo", "Food", "Good", "Test", "God" ];
	arr = $.map(source, function (value) {
			var search = new RegExp(src_keyword, "gi");
			if(value.match(search)) {
				return value;
			}
		}
	);
	return arr;
}

function setValue(id, str, divId) {
	$('#' + id).val(str);
	searchasciiconverter();
	$('#' + divId).hide();
	return false;
}
function showSearchList(ctrl, listDiv, source) {
	data = loadAutocomplete(ctrl, source);
	
	$('#' + listDiv).hide();
	targetCtrl = $(ctrl).attr('id');
	$('#' + listDiv + ' li').remove();
	var x = 0;
	if(!empty(data)) {
		$('#' + listDiv).append('<li data-icon="delete"><a href="#" onclick="' +
									'hideSuggestion( \'' + listDiv + '\');"></a></li>');
		$.each(data, function(){
			if(x < 6) {
				$('#' + listDiv).append('<li onclick="' +
						'return setValue( \'' + targetCtrl + '\' , \'' + this.replace("&#39;", '*|*') + '\', \'' + listDiv + '\');'+
						'" class="hand">' + this + '</li>');
				x ++;
			} else {
				return false;	
			}
		});
		
		$('#' + listDiv).listview('refresh');
		$('#' + listDiv).show();
	}
}

function hideSuggestion(id) {
	$('#' + id).hide();
}
/*
	sample list generator
*/

function generateList(data,listId) {
	for(i = 0; i < data.length; i++) {
		$('#' + listId).append('<li><a href="">' + data[i].name + '</a></li>');
	}
	$('#' + listId).listview('refresh');
}

/*
set dropdown selected

param Id -> domId
param value -> selected option value

return selected option
*/
function setDropdownSelected(id,value,isRefresh) {
	if(value != "") {		
		$("#" + id).val(value);
	} 
	if(empty(isRefresh)) {
		$("#" + id).selectmenu('refresh', true);
	}
	//$("#" + id).val("'" + value + "'");
}

function setFieldValue(id,data){
	$('#'+id).val(data);
}

function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

//string replace
function replaceString(value,replaceTo,replaceWith){
	
	if(!empty(value)){
		return value.replace(new RegExp(replaceTo, "g"),replaceWith);
	}
}
function unwantedValueToString(data){
	
	if(String(data) == 'NaN'){
		data = '-';
	}else if(data == null){
		data = '-';
	}
	return data;
}



function round(number, decimals){
	//return parseFloat(number.toFixed(decimals));
	return parseFloat(Math.round(number * 100) / 100).toFixed(decimals);

}

function setErrorMessages(data) {
	$(".invalid-data").remove();
	$(".invalid").removeClass('invalid');
	if(!empty(data.FieldError)) {
		$.each(data.FieldError, function(){
			
			if(this.control.length > 0) {
				$("[name='" + this.control + "']").addClass('invalid');
				$("[name='" + this.control + "']").after('<div  class="invalid-data">'+this.error+'</div>');
				
			}
		});
	}
}

function convertToUSDate(mysql_date) {
	var d = new Date(mysql_date);
	var dt = d.getDate();
	var mon = d.getMonth();
	mon++;
	var yr = d.getFullYear();
	
	return mon + "/" + dt + "/" + yr;
}

function confirmDialog(title, msg) {
	$("#yes-txt").html("Yes");
	$("#btnConfirmNo").show();
	
	if(!empty(title)) $('#popup-title').html(title);
	if(!empty(msg)) $('#popup-text').html(msg);
	
	$('#btnConfirmNo').unbind("click", null);
	$('#btnConfirmNo').on("click", function() { showHideLightBox()});
	$('#btnConfirmYes').on("click", function() { showHideLightBox()});
	
	showHideLightBox(1);
}

function alertDialog(title, msg) {
	$("#yes-txt").html("Ok");
	$("#btnConfirmNo").hide();
	
	if(!empty(title)) $('#popup-title').html(title);
	if(!empty(msg)) $('#popup-text').html(msg);
	
	$('#btnConfirmYes').unbind("click", null);
	$('#btnConfirmYes').on("click", function() {showHideLightBox()});
	
	showHideLightBox(1);
}

function showHideLightBox(stat) {
	if(stat == 1) {
		$('#lightbox-overlay').show();
		$('.lightbox-container').show();
	} else {
		$('#lightbox-overlay').hide();
		$('.lightbox-container').hide();
	}
}

/*version 1.1*/
	// json string to array
	function jStrToArray(data){
		return JSON.parse('[' + data + ']');		
	}
	
	//set chckbox
	function setCheckBox(id,data){
		if(data == 'on'){
			$("#"+id).attr('checked',true);
		} else {
			$("#"+id).attr('checked',false);
		}
		$("#" + id).checkboxradio('refresh', true);
	}