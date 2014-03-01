			//alert('Yess');
			
			var pushNotification;
            
			function callbackAPPID(data) {
				alert('Posted successfully');
							
			}	
            // handle GCM notifications for Android
			
            function onDeviceReady() {
				try 
				{ 
                	pushNotification = window.plugins.pushNotification;
                	if (device.platform == 'android' || device.platform == 'Android') {
                    	pushNotification.register(successHandler, errorHandler, {"senderID":"325770691942","ecb":"onNotificationGCM"});		// required!
					} else {
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

            function onNotificationGCM(e) {
				//alert(e.event);
                switch( e.event ) {
                    case 'registered':
					alert(e.regid.length);
					if ( e.regid.length > 0 ) {
						params = { callback : 'callbackAPPID', controller : 'Driver', action : 'appid', data : [{ userId : e.regid }] }; 
						getAjaxData(params, 'callbackAPPID');
						
						//console.log("regID = " + e.regid);	
						alert("regID = " + e.regid);
					}
                    break;
                }
            }
            
            function tokenHandler (result) { }
			function successHandler (result) {  }
            function errorHandler (error) { }
            