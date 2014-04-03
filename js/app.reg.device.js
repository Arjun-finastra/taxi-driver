			//alert('Yess');
			
			var pushNotification;
            
			function callbackAPPID(data) {
				//alert('yesssssssssssssss');
				window.location.href = "my-vehicles.html";
							
			}	
            // handle GCM notifications for Android
			
           
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

            function onNotificationGCM(e) {
				switch( e.event ) {
                    case 'registered':
					if ( e.regid.length > 0 ) {
						params = { callback : 'callbackAPPID', controller : 'Drivers', action : 'appid', data : [{ deviceRegId : e.regid, driverId : localStorage.getItem("driverid") }] }; 
						getAjaxData(params, 'callbackAPPID');
					}
                    break;
					
					case 'message':
                    	// if this flag is set, this notification happened while we were in the foreground.
                    	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
                    	/*if (e.foreground)
                    	{
							//$("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
							
							// if the notification contains a soundname, play it.
							var my_media = new Media("/android_asset/www/"+e.soundname);
							my_media.play();
						}
						else
						{	// otherwise we were launched because the user touched a notification in the notification tray.
							if (e.coldstart)
								//$("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
							else
							$("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
						}*/
							
						//$("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
						//$("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
						
						if(e.payload.message == 'New Job'){
							navigator.notification.beep(3);
							navigator.notification.vibrate(2500);
							$('#popupBasic').popup('open');
						}
                    break;
                }
            }
            
            function tokenHandler (result) { }
			function successHandler (result) {  }
            function errorHandler (error) { }
            