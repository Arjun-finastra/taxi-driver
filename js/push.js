 var pushNotification;
            
            function onDeviceReady() {
                //$("#app-status-ul").append('<li>deviceready event received</li>');
                
				/*document.addEventListener("backbutton", function(e)
				{
                	$("#app-status-ul").append('<li>backbutton event received</li>');
  					
      				if( $("#home").length > 0)
					{
						// call this to get a new token each time. don't call it to reuse existing token.
						//pushNotification.unregister(successHandler, errorHandler);
						e.preventDefault();
						navigator.app.exitApp();
						//alert(navigator);
					}
					else
					{
						navigator.app.backHistory();
					}
				}, false);*/
			
				try 
				{ 
                	pushNotification = window.plugins.pushNotification;
                	if (device.platform == 'android' || device.platform == 'Android') {
						//$("#app-status-ul").append('<li>registering android</li>');
                    	pushNotification.register(successHandler, errorHandler, {"senderID":"325770691942","ecb":"onNotificationGCM"});		// required!
					} else {
						$("#app-status-ul").append('<li>registering iOS</li>');
                    	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
                	}
                }
				catch(err) 
				{ 
					txt="There was an error on this page.\n\n"; 
					txt+="Error description: " + err.message + "\n\n"; 
					alert(txt); 
				} 
            }
            
            // handle APNS notifications for iOS
            function onNotificationAPN(e) {
                if (e.alert) {
                     $("#app-status-ul").append('<li>push-notification: ' + e.alert + '</li>');
                     navigator.notification.alert(e.alert);
                }
                    
                if (e.sound) {
                    var snd = new Media(e.sound);
                    snd.play();
                }
                
                if (e.badge) {
                    pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
                }
            }
            
            // handle GCM notifications for Android
            function onNotificationGCM(e) {  
                switch( e.event )
                {
                    case 'registered':
					if ( e.regid.length > 0 )
					{
						params = { callback : 'callbackAPPID', controller : 'Drivers', action : 'appid', data : [{ deviceRegId : e.regid, driverId : localStorage.getItem("driverid") }] }; 
						getAjaxData(params, 'callbackAPPID');						
					}
                    break;
                    
                    case 'message':
                    	// if this flag is set, this notification happened while we were in the foreground.
                    	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    	if (e.foreground)
                    	{
							
							if(e.payload.title == 'New Job'){
								//alert('Yes foreground');
								//playAudio('/android_asset/www/chacha.wav');
								//navigator.notification.beep(1);
								//navigator.notification.vibrate(1000);
								window.location.reload();
								//$('#popupBasic').popup('open');
							}
							
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.
							
							//if (e.coldstart){ }else{ 	navigator.notification.beep(3); navigator.notification.vibrate(2500); $('#popupBasic').popup('open');							}
							if(e.payload.title == 'New Job'){
									//alert("New Job");
									//playAudio('/android_asset/www/chacha.wav');
									//navigator.notification.vibrate(1000);
									//window.location.reload();
									//$('#popupBasic').popup('open');
									alert('Yes Background');
							}
						}			
						
                    break;
                    
                    case 'error':
						$("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                    break;
                    
                    default:
						$("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                    break;
                }
            }
            
            function tokenHandler (result) {
                $("#app-status-ul").append('<li>token: '+ result +'</li>');
                // Your iOS push server needs to know the token before it can push to this device
                // here is where you might want to send it the token for later use.
            }
			
            function successHandler (result) {
                $("#app-status-ul").append('<li>success:'+ result +'</li>');
            }
            
            function errorHandler (error) {
                $("#app-status-ul").append('<li>error:'+ error +'</li>');
            }
			
			
			function callbackAPPID (data) {
                //$("#app-status-ul").append('<li>error:'+ error +'</li>');
				window.location.href = "my-vehicles.html";
            }
            
			/* sound play */


			function playAudio(url) {
				// Play the audio file at url
				var my_media = new Media(url,
					// success callback
					function () {
						console.log("playAudio():Audio Success");
						//alert('success');
					},
					// error callback
					function (err) {
						console.log("playAudio():Audio Error: " + err);
						alert(err);
						
						//params = { callback : 'callbackSendMail', controller : 'Users', action : 'sendMail', data : [{ stringText : err }] };
						//getAjaxData(params, 'callbackSendMail');
						
						//alert(document.location.pathname);
					}
				);
				// Play audio
				my_media.play();
			}
			//document.addEventListener('deviceready', onDeviceReady, true);
