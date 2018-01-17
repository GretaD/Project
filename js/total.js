var a;//var global per username
var b;//var global per password
var globalcookie;

function start()
{
	cookieGuid();
	var FingerprintCheck =new Object();
	FingerprintCheck=totaljs();
	FingerprintCheck.Cookie=globalcookie;
	//alert(JSON.stringify(FingerprintCheck));
	$.ajax({

        url: "enterdata.php",
        type: 'POST',
        async: false,
        data: {
            "check": JSON.stringify(FingerprintCheck)
        },
        success: function(data) {

            alert(data);
        }
    });
	
}
function cookieGuid()
{ 
var temp=fingerprint_cookie();

// ns ska cookies i krijojme
	if (temp=="false")
	{
			var a=createGuid();
			temp=setCookie("fp",a,30);
			globalcookie=a;
			
	}

	//nese ka e lexojme
	else
	{
		temp=readCookie("fp");
		//nese nuk ka vlere te paracaktuar ne fp
			if (temp=="undefined" || temp=="")
		{
			//ia cakktojme nje vlere unike
			var a=createGuid();
			temp=SetCookie("fp",a,30);
			globalcookie=a;
			
		}
		else
			globalcookie=temp;
		
	
	}
	
	
}
function readCookie(cookieName) {
 var re = new RegExp('[; ]'+cookieName+'=([^\\s;]*)');
 var sMatch = (' '+document.cookie).match(re);
 if (cookieName && sMatch)
	 return unescape(sMatch[1]);
 return '';
}

function fingerprint_cookie() {
        "use strict";
        var strOnError, bolCookieEnabled, bolOut;

        strOnError = "Error";
        bolCookieEnabled = null;
        bolOut = null;

        try {
            bolCookieEnabled = (navigator.cookieEnabled) ? true : false;

            //if not IE4+ nor NS6+
            if (typeof navigator.cookieEnabled === "undefined" && !bolCookieEnabled) {
                document.cookie = "testcookie";
                bolCookieEnabled = (document.cookie.indexOf("testcookie") !== -1) ? true : false;
            }
            bolOut = bolCookieEnabled;
            console.log(bolOut);
            return bolOut;
        } catch (err) {
            return strOnError;
        }
    }
	
function SetCookie(cookieName,cookieValue,nDays) 
{
 var today = new Date();
 var expire = new Date();
 if (nDays==null || nDays==0) nDays=1;
 expire.setTime(today.getTime() + 3600000*24*nDays);
 document.cookie = cookieName+"="+escape(cookieValue)+";expires="+expire.toGMTString();
}

function Username(username) {
   
    a = username;

}

function Password(password) {
    b = password;
   

}
function createGuid()
 {  
   function _p8(s) {  
      var p = (Math.random().toString(16)+"000000000").substr(2,8);  
      return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;  
   }  
   return _p8() + _p8(true) + _p8(true) + _p8();  
} 

//funskion qe ruan në tabelë të dhënat fillestare.
function insertCredentials() {
    var UsPass = new Object();
    UsPass.username = a;
    UsPass.password = b;
    //nëse nuk ndryshohen të dhënat default mos e fut ne db
    if ((UsPass.username == null ) || (UsPass.password == null ))
		
        return;
//dërgohen të dhënat në databazë   
   else {
        $.ajax({

            url: "enterdata.php",
            type: 'POST',
            async: false,
            data: {
                "credentials": JSON.stringify(UsPass)
				//dërgohet objekti me emer, pass
            },
            success: function(data) {
				//nga databaza kthehen të dhëna  ID
		
				// pasi ka kthyer databaza keto të dhëna fusim vlerat e mbetura.
               insertfp(data);


            }
        });

    }

}

function insertfp(id) {
	
    var Fingerprint = new Object();
	//thirret funksioni që mbledh të dhënat fingerprint.
    Fingerprint = totaljs();
	//objekit Fingerprint i shthohen dy atribute : id dhe cookie.
    Fingerprint.ID = id;
	Fingerprint.Cookie=globalcookie;
	
  
    $.ajax({

        url: "enterdata.php",
        type: 'POST',
        async: false,
        data: {
            "points": JSON.stringify(Fingerprint)
        },
        success: function(data) {

            alert(data);
        }
    });
}




function totaljs() {
	
	//kthen të dhënat rreth browserit me navigatorin.
    function fingerprint_browser() 
	{
        "use strict";
        var strOnError, strUserAgent, numVersion, strBrowser, strOut;

        strOnError = "Error";
        strUserAgent = null;
        numVersion = null;
        strBrowser = null;
        strOut = null;

        try {
            strUserAgent = navigator.userAgent.toLowerCase();
            if (/msie (\d+\.\d+);/.test(strUserAgent)) { //test for MSIE x.x;
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                if (strUserAgent.indexOf("trident/6") > -1) {
                    numVersion = 10;
                }
                if (strUserAgent.indexOf("trident/5") > -1) {
                    numVersion = 9;
                }
                if (strUserAgent.indexOf("trident/4") > -1) {
                    numVersion = 8;
                }
                strBrowser = "Internet Explorer " + numVersion;
            } else if (strUserAgent.indexOf("trident/7") > -1) { //IE 11+ gets rid of the legacy 'MSIE' in the user-agent string;
                numVersion = 11;
                strBrowser = "Internet Explorer " + numVersion;
            } else if (/firefox[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Firefox " + numVersion;
            } else if (/opera[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Opera/x.x or Opera x.x (ignoring remaining decimal places);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Opera " + numVersion;
            } else if (/chrome[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Chrome/x.x or Chrome x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Chrome " + numVersion;
            } else if (/version[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Version/x.x or Version x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Safari " + numVersion;
            } else if (/rv[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for rv/x.x or rv x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Mozilla " + numVersion;
            } else if (/mozilla[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Mozilla/x.x or Mozilla x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Mozilla " + numVersion;
            } else if (/binget[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for BinGet/x.x or BinGet x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (BinGet) " + numVersion;
            } else if (/curl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Curl/x.x or Curl x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (cURL) " + numVersion;
            } else if (/java[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Java/x.x or Java x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (Java) " + numVersion;
            } else if (/libwww-perl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for libwww-perl/x.x or libwww-perl x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (libwww-perl) " + numVersion;
            } else if (/microsoft url control -[\s](\d+\.\d+)/.test(strUserAgent)) { //test for Microsoft URL Control - x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (Microsoft URL Control) " + numVersion;
            } else if (/peach[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for Peach/x.x or Peach x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (Peach) " + numVersion;
            } else if (/php[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for PHP/x.x or PHP x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (PHP) " + numVersion;
            } else if (/pxyscand[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for pxyscand/x.x or pxyscand x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1); // capture x.x portion and store as a number
                strBrowser = "Library (pxyscand) " + numVersion;
            } else if (/pycurl[\/\s](\d+\.\d+)/.test(strUserAgent)) { //test for pycurl/x.x or pycurl x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1);
                // capture x.x portion and store as a number
                strBrowser = "Library (PycURL) " + numVersion;
            } else if (/python-urllib[\/\s](\d+\.\d+)/.test(strUserAgent)) {
                //test for python-urllib/x.x or python-urllib x.x (ignoring remaining digits);
                numVersion = Number(RegExp.$1);
                // capture x.x portion and store as a number
                strBrowser = "Library (Python URLlib) " + numVersion;
            } else if (/appengine-google/.test(strUserAgent)) {
                //test for AppEngine-Google;
                numVersion = Number(RegExp.$1);
                // capture x.x portion and store as a number
                strBrowser = "Cloud (Google AppEngine) " + numVersion;
            } else {
                strBrowser = "Unknown";
            }
            strOut = strBrowser;

            var BrowserOut = new Object();
            BrowserOut.strBrowser = strBrowser;
            BrowserOut.strUserAgent = strUserAgent;
            BrowserOut.numVersion = numVersion;
             return BrowserOut;



        } catch (err) {
            return strOnError;
        }

    }

   
// mxirren të dhëna plugin nga objekti navigator
	function fingerprint_plugins()
	{
		 if (typeof navigator['plugins'] !== "undefined") {
            var plgs = "";
            var plg_props = ['name', 'description', 'filename'];
            for (var i = 0; i < navigator.plugins.length; i++) {
                var current_plg = "{";
                for (var prop in plg_props) {
                    if (typeof navigator.plugins[i][plg_props[prop]] !== "undefined") {
                        current_plg += (plg_props[prop] + ":" + navigator.plugins[i][plg_props[prop]]) + ",";
                    }
                }
                current_plg += "}";
                plgs += current_plg;
            }
        }
		
		return plgs;
		
	}
//kryen vizatimin/provën canvas
    function fingerprint_canvas() {
        "use strict";
        var strOnError, canvas, strCText, strText, strOut;

        strOnError = "Error";
        canvas = null;
        strCText = null;
        strText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ`~1!2@3#4$5%6^7&8*9(0)-_=+[{]}|;:',<.>/?";
        strOut = null;

        try {
			// vizatim i nje imazhi ne ekran cfaredo.
            canvas = document.createElement('canvas');
            strCText = canvas.getContext('2d');
            strCText.textBaseline = "top";
            strCText.font = "14px 'Arial'";
            strCText.textBaseline = "alphabetic";
            strCText.fillStyle = "#f60";
            strCText.fillRect(125, 1, 62, 20);
            strCText.fillStyle = "#069";
            strCText.fillText(strText, 2, 15);
            strCText.fillStyle = "rgba(102, 204, 0, 0.7)";
            strCText.fillText(strText, 4, 17);
            strOut = canvas.toDataURL();

            return strOut;
        } catch (err) {
            return strOnError;
        }
    }



    // Funksion i cili kthen true nëse ka cookie dhe false nëse ska

    function fingerprint_cookie() {
        "use strict";
        var strOnError, bolCookieEnabled, bolOut;

        strOnError = "Error";
        bolCookieEnabled = null;
        bolOut = null;

        try {
            bolCookieEnabled = (navigator.cookieEnabled) ? true : false;

            //if not IE4+ nor NS6+
            if (typeof navigator.cookieEnabled === "undefined" && !bolCookieEnabled) {
                document.cookie = "testcookie";
                bolCookieEnabled = (document.cookie.indexOf("testcookie") !== -1) ? true : false;
            }
            bolOut = bolCookieEnabled;
            console.log(bolOut);
            return bolOut;
        } catch (err) {
            return strOnError;
        }
    }


    // Kthen color depth, width, height, available width dhe available height të pajisjes

    function fingerprint_display() {
        "use strict";
        var strSep, strPair, strOnError, strScreen, strDisplay, strOut;


        strOnError = "Error";
        strScreen = null;
        strDisplay = null;
        strOut = null;

        try {
            strScreen = window.screen;
            if (strScreen) {
                strDisplay = strScreen.colorDepth + strSep + strScreen.width + strSep + strScreen.height + strSep + strScreen.availWidth + strSep + strScreen.availHeight;
            }
            strOut = new Object();
            strOut.colorDepth = strScreen.colorDepth;
            strOut.width = strScreen.width;
            strOut.height = strScreen.height;
            strOut.availWidth = strScreen.availWidth;
            strOut.availHeight = strScreen.availHeight;

            //console.log(strOut);
            return strOut;
        } catch (err) {
            return strOnError;
        }
    }

    function fingerprint_java() {
        "use strict";
        var strOnError, strJavaEnabled, strOut;

        strOnError = "Error";
        strJavaEnabled = null;
        strOut = null;

        try {
            if (navigator.javaEnabled()) {
                strJavaEnabled = "true";
            } else {
                strJavaEnabled = "false";
            }
            strOut = strJavaEnabled;
            
            return strOut;
        } catch (err) {
            return strOnError;
        }
    }
    /* Fingerprint Latency */
    function fingerprint_latency() {
        "use strict";
        var perfData, dns, connection, requestTime, networkLatency;

        perfData = null;
        dns = null;
        connection = null;
        requestTime = null;
        networkLatency = null;

        try {
            // supported by a number of modern browsers
            perfData = window.performance.timing;
            requestTime = perfData.responseStart - perfData.requestStart;
            networkLatency = perfData.responseEnd - perfData.fetchStart;

            var strOut = new Object();
            strOut.requestTime = requestTime;
            strOut.networkLatency = networkLatency;

            //console.log(strOut);
            return strOut;
        } catch (err) {
            return "Unknown";
        }
    }
    //Kthen sistemin operativ dhe numrin e biteve qe perdor browseri  
    function fingerprint_os() {
        "use strict";
        var strSep, strOnError, strUserAgent, strPlatform, strOS, strOSBits, strOut;

        strSep = "|";
        strOnError = "Error";
        strUserAgent = null;
        strPlatform = null;
        strOS = null;
        strOSBits = null;
        strOut = null;

        try {
            /* navigator.userAgent is supported by all major browsers */
            strUserAgent = navigator.userAgent.toLowerCase();
            /* navigator.platform is supported by all major browsers */
            strPlatform = navigator.platform.toLowerCase();
            if (strUserAgent.indexOf("windows nt 6.3") !== -1) {
                strOS = "Windows 8.1";
            } else if (strUserAgent.indexOf("windows nt 6.2") !== -1) {
                strOS = "Windows 8";
            } else if (strUserAgent.indexOf("windows nt 6.1") !== -1) {
                strOS = "Windows 7";
            } else if (strUserAgent.indexOf("windows nt 6.0") !== -1) {
                strOS = "Windows Vista/Windows Server 2008";
            } else if (strUserAgent.indexOf("windows nt 5.2") !== -1) {
                strOS = "Windows XP x64/Windows Server 2003";
            } else if (strUserAgent.indexOf("windows nt 5.1") !== -1) {
                strOS = "Windows XP";
            } else if (strUserAgent.indexOf("windows nt 5.01") !== -1) {
                strOS = "Windows 2000, Service Pack 1 (SP1)";
            } else if (strUserAgent.indexOf("windows xp") !== -1) {
                strOS = "Windows XP";
            } else if (strUserAgent.indexOf("windows 2000") !== -1) {
                strOS = "Windows 2000";
            } else if (strUserAgent.indexOf("windows nt 5.0") !== -1) {
                strOS = "Windows 2000";
            } else if (strUserAgent.indexOf("windows nt 4.0") !== -1) {
                strOS = "Windows NT 4.0";
            } else if (strUserAgent.indexOf("windows nt") !== -1) {
                strOS = "Windows NT 4.0";
            } else if (strUserAgent.indexOf("winnt4.0") !== -1) {
                strOS = "Windows NT 4.0";
            } else if (strUserAgent.indexOf("winnt") !== -1) {
                strOS = "Windows NT 4.0";
            } else if (strUserAgent.indexOf("windows me") !== -1) {
                strOS = "Windows ME";
            } else if (strUserAgent.indexOf("win 9x 4.90") !== -1) {
                strOS = "Windows ME";
            } else if (strUserAgent.indexOf("windows 98") !== -1) {
                strOS = "Windows 98";
            } else if (strUserAgent.indexOf("win98") !== -1) {
                strOS = "Windows 98";
            } else if (strUserAgent.indexOf("windows 95") !== -1) {
                strOS = "Windows 95";
            } else if (strUserAgent.indexOf("windows_95") !== -1) {
                strOS = "Windows 95";
            } else if (strUserAgent.indexOf("win95") !== -1) {
                strOS = "Windows 95";
            } else if (strUserAgent.indexOf("ce") !== -1) {
                strOS = "Windows CE";
            } else if (strUserAgent.indexOf("win16") !== -1) {
                strOS = "Windows 3.11";
            } else if (strUserAgent.indexOf("iemobile") !== -1) {
                strOS = "Windows Mobile";
            } else if (strUserAgent.indexOf("wm5 pie") !== -1) {
                strOS = "Windows Mobile";
            } else if (strUserAgent.indexOf("windows") !== -1) {
                strOS = "Windows (Unknown Version)";
            } else if (strUserAgent.indexOf("openbsd") !== -1) {
                strOS = "Open BSD";
            } else if (strUserAgent.indexOf("sunos") !== -1) {
                strOS = "Sun OS";
            } else if (strUserAgent.indexOf("ubuntu") !== -1) {
                strOS = "Ubuntu";
            } else if (strUserAgent.indexOf("ipad") !== -1) {
                strOS = "iOS (iPad)";
            } else if (strUserAgent.indexOf("ipod") !== -1) {
                strOS = "iOS (iTouch)";
            } else if (strUserAgent.indexOf("iphone") !== -1) {
                strOS = "iOS (iPhone)";
            } else if (strUserAgent.indexOf("mac os x beta") !== -1) {
                strOS = "Mac OSX Beta (Kodiak)";
            } else if (strUserAgent.indexOf("mac os x 10.0") !== -1) {
                strOS = "Mac OSX Cheetah";
            } else if (strUserAgent.indexOf("mac os x 10.1") !== -1) {
                strOS = "Mac OSX Puma";
            } else if (strUserAgent.indexOf("mac os x 10.2") !== -1) {
                strOS = "Mac OSX Jaguar";
            } else if (strUserAgent.indexOf("mac os x 10.3") !== -1) {
                strOS = "Mac OSX Panther";
            } else if (strUserAgent.indexOf("mac os x 10.4") !== -1) {
                strOS = "Mac OSX Tiger";
            } else if (strUserAgent.indexOf("mac os x 10.5") !== -1) {
                strOS = "Mac OSX Leopard";
            } else if (strUserAgent.indexOf("mac os x 10.6") !== -1) {
                strOS = "Mac OSX Snow Leopard";
            } else if (strUserAgent.indexOf("mac os x 10.7") !== -1) {
                strOS = "Mac OSX Lion";
            } else if (strUserAgent.indexOf("mac os x") !== -1) {
                strOS = "Mac OSX (Version Unknown)";
            } else if (strUserAgent.indexOf("mac_68000") !== -1) {
                strOS = "Mac OS Classic (68000)";
            } else if (strUserAgent.indexOf("68K") !== -1) {
                strOS = "Mac OS Classic (68000)";
            } else if (strUserAgent.indexOf("mac_powerpc") !== -1) {
                strOS = "Mac OS Classic (PowerPC)";
            } else if (strUserAgent.indexOf("ppc mac") !== -1) {
                strOS = "Mac OS Classic (PowerPC)";
            } else if (strUserAgent.indexOf("macintosh") !== -1) {
                strOS = "Mac OS Classic";
            } else if (strUserAgent.indexOf("googletv") !== -1) {
                strOS = "Android (GoogleTV)";
            } else if (strUserAgent.indexOf("xoom") !== -1) {
                strOS = "Android (Xoom)";
            } else if (strUserAgent.indexOf("htc_flyer") !== -1) {
                strOS = "Android (HTC Flyer)";
            } else if (strUserAgent.indexOf("android") !== -1) {
                strOS = "Android";
            } else if (strUserAgent.indexOf("symbian") !== -1) {
                strOS = "Symbian";
            } else if (strUserAgent.indexOf("series60") !== -1) {
                strOS = "Symbian (Series 60)";
            } else if (strUserAgent.indexOf("series70") !== -1) {
                strOS = "Symbian (Series 70)";
            } else if (strUserAgent.indexOf("series80") !== -1) {
                strOS = "Symbian (Series 80)";
            } else if (strUserAgent.indexOf("series90") !== -1) {
                strOS = "Symbian (Series 90)";
            } else if (strUserAgent.indexOf("x11") !== -1) {
                strOS = "UNIX";
            } else if (strUserAgent.indexOf("nix") !== -1) {
                strOS = "UNIX";
            } else if (strUserAgent.indexOf("linux") !== -1) {
                strOS = "Linux";
            } else if (strUserAgent.indexOf("qnx") !== -1) {
                strOS = "QNX";
            } else if (strUserAgent.indexOf("os/2") !== -1) {
                strOS = "IBM OS/2";
            } else if (strUserAgent.indexOf("beos") !== -1) {
                strOS = "BeOS";
            } else if (strUserAgent.indexOf("blackberry95") !== -1) {
                strOS = "Blackberry (Storm 1/2)";
            } else if (strUserAgent.indexOf("blackberry97") !== -1) {
                strOS = "Blackberry (Bold)";
            } else if (strUserAgent.indexOf("blackberry96") !== -1) {
                strOS = "Blackberry (Tour)";
            } else if (strUserAgent.indexOf("blackberry89") !== -1) {
                strOS = "Blackberry (Curve 2)";
            } else if (strUserAgent.indexOf("blackberry98") !== -1) {
                strOS = "Blackberry (Torch)";
            } else if (strUserAgent.indexOf("playbook") !== -1) {
                strOS = "Blackberry (Playbook)";
            } else if (strUserAgent.indexOf("wnd.rim") !== -1) {
                strOS = "Blackberry (IE/FF Emulator)";
            } else if (strUserAgent.indexOf("blackberry") !== -1) {
                strOS = "Blackberry";
            } else if (strUserAgent.indexOf("palm") !== -1) {
                strOS = "Palm OS";
            } else if (strUserAgent.indexOf("webos") !== -1) {
                strOS = "WebOS";
            } else if (strUserAgent.indexOf("hpwos") !== -1) {
                strOS = "WebOS (HP)";
            } else if (strUserAgent.indexOf("blazer") !== -1) {
                strOS = "Palm OS (Blazer)";
            } else if (strUserAgent.indexOf("xiino") !== -1) {
                strOS = "Palm OS (Xiino)";
            } else if (strUserAgent.indexOf("kindle") !== -1) {
                strOS = "Kindle";
            } else if (strUserAgent.indexOf("wii") !== -1) {
                strOS = "Nintendo (Wii)";
            } else if (strUserAgent.indexOf("nintendo ds") !== -1) {
                strOS = "Nintendo (DS)";
            } else if (strUserAgent.indexOf("playstation 3") !== -1) {
                strOS = "Sony (Playstation Console)";
            } else if (strUserAgent.indexOf("playstation portable") !== -1) {
                strOS = "Sony (Playstation Portable)";
            } else if (strUserAgent.indexOf("webtv") !== -1) {
                strOS = "MSN TV (WebTV)";
            } else if (strUserAgent.indexOf("inferno") !== -1) {
                strOS = "Inferno";
            } else {
                strOS = "Unknown";
            }
            if (strPlatform.indexOf("x64") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("wow64") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("win64") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("win32") !== -1) {
                strOSBits = "32 bits";
            } else if (strPlatform.indexOf("x64") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("x32") !== -1) {
                strOSBits = "32 bits";
            } else if (strPlatform.indexOf("x86") !== -1) {
                strOSBits = "32 bits*";
            } else if (strPlatform.indexOf("ppc") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("alpha") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("68k") !== -1) {
                strOSBits = "64 bits";
            } else if (strPlatform.indexOf("iphone") !== -1) {
                strOSBits = "32 bits";
            } else if (strPlatform.indexOf("android") !== -1) {
                strOSBits = "32 bits";
            } else {
                strOSBits = "Unknown";
            }
            strOut = new Object();
            strOut.strOs = strOS;
            strOut.strOSBits = strOSBits;
            //console.log(strOut);
            return strOut;
        } catch (err) {
            return strOnError;
        }
    }
    

	   
 
   //Kthen gjuhen e sistemit, browserin dhe të përdoruesit.
   function fingerprint_timezone() {
    "use strict";
    var strOnError, dtDate, numOffset, numGMTHours, numOut;

    strOnError = "Error";
    dtDate = null;
    numOffset = null;
    numGMTHours = null;
    numOut = null;

    try {
        dtDate = new Date();
        numOffset = dtDate.getTimezoneOffset();
        numGMTHours = (numOffset / 60) * (-1);
        numOut = numGMTHours;
        return numOut;
    } catch (err) {
        return strOnError;
    }
}
   function fingerprint_language() {
        "use strict";
        var strSep, strPair, strOnError, strLang, strTypeLng, strTypeBrLng, strTypeSysLng, strTypeUsrLng, strOut;

        strSep = "|";
        strPair = "=";
        strOnError = "Error";
        strLang = null;
        strTypeLng = null;
        strTypeBrLng = null;
        strTypeSysLng = null;
        strTypeUsrLng = null;
        strOut = null;

        try {
            strTypeLng = typeof(navigator.language);
            strTypeBrLng = typeof(navigator.browserLanguage);
            strTypeSysLng = typeof(navigator.systemLanguage);
            strTypeUsrLng = typeof(navigator.userLanguage);
            strOut = new Object();

            if (strTypeLng !== "undefined") {
                strOut.strLang = navigator.language;
            } else if (strTypeBrLng !== "undefined") {
                strOut.strBrLng = navigator.browserLanguage;
            }

            if (strTypeSysLng !== "undefined") {
                strOut.strTypeSysLng = navigator.systemLanguage;
            } else {
                strOut.strTypeSysLng = "null";
            }
            if (strTypeUsrLng !== "undefined") {
                strOut.strTypeUsrLng = navigator.userLanguage;
            } else {
                strOut.strTypeUsrLng = "null";
            }

            //console.log(strOut);
            return strOut;
        } catch (err) {
            return strOnError;
        }
    }
//Funksioni që teston fontet.
    function fingerprint_fonts() {

        var fonts = ["cursive", "monospace", "serif", "sans-serif", "fantasy", "default", "Arial", "Arial Black", "Arial Narrow", "Arial Rounded MT Bold", "Book Antiqua", "Bookman Old Style", "Bradley Hand ITC", "Bodoni MT", "Calibri", "Century", "Century Gothic", "Casual", "Comic Sans MS", "Consolas", "Copperplate Gothic Bold", "Courier", "Courier New", "English Text MT", "Felix Titling", "Futura", "Garamond", "Geneva", "Georgia", "Gentium", "Haettenschweiler", "Helvetica", "Impact", "Jokerman", "King", "Kootenay", "Latha", "Liberation Serif", "Lucida Console", "Lalit", "Lucida Grande", "Magneto", "Mistral", "Modena", "Monotype Corsiva", "MV Boli", "OCR A Extended", "Onyx", "Palatino Linotype", "Papyrus", "Parchment", "Pericles", "Playbill", "Segoe Print", "Shruti", "Tahoma", "TeX", "Times", "Times New Roman", "Trebuchet MS", "Verdana", "Verona", "Comic Sans MS", "Arial Black", "Arial CYR", "Chiller", "Arial Narrow", "Arial Rounded MT Bold", "Baskerville Old Face", "Berlin Sans FB", "Blackadder ITC", "Lucida Console", "Symbol", "Times New Roman", "Webdings", "Agency FB", "Vijaya", "Algerian", "Arial Unicode MS", "Bodoni MT Poster Compressed", "Bookshelf Symbol 7", "Calibri", "Cambria", "Cambria Math", "Kartika", "MS Mincho", "MS Outlook", "MT Extra", "Segoe UI", "Aharoni", "Aparajita", "Amienne", "cursive", "Academy Engraved LET", "LCD", "LuzSans-Book", "sans-serif", "ZWAdobeF", "Eurostile", "SimSun-PUA", "Blackletter686 BT", "Myriad Web Pro Condensed", "Matisse ITC", "Bell Gothic Std Black", "David Transparent", "Adobe Caslon Pro", "AR BERKLEY", "Australian Sunrise", "Myriad Web Pro", "Gentium Basic", "Highlight LET", "Adobe Myungjo Std M", "GothicE", "HP PSG", "DejaVu Sans", "Arno Pro", "Futura Bk", "DejaVu Sans Condensed", "Euro Sign", "Neurochrome", "Bell Gothic Std Light", "Jokerman Alts LET", "Adobe Fan Heiti Std B", "Baby Kruffy", "Tubular", "Woodcut", "HGHeiseiKakugothictaiW3", "YD2002", "Tahoma Small Cap", "Helsinki", "Bickley Script", "Unicorn", "X-Files", "GENISO", "Frutiger SAIN Bd v.1", "Opus", "ZDingbats", "ABSALOM", "Vagabond", "Year supply of fairy cakes", "Myriad Condensed Web", "Segoe Media Center", "Coronet", "Helsinki Metronome", "Segoe Condensed", "Weltron Urban", "AcadEref", "DecoType Naskh", "Freehand521 BT", "Opus Chords Sans", "Enviro", "SWGamekeys MT", "Croobie", "Arial Narrow Special G1", "AVGmdBU", "Candles", "Futura Bk BT", "Andy", "QuickType", "WP Arabic Sihafa", "DigifaceWide", "ELEGANCE", "BRAZIL", "Pepita MT", "Nina", "Geneva", "OCR B MT", "Futura", "Blade Runner Movie Font", "Allegro BT", "Lucida Blackletter", "AGA Arabesque", "AdLib BT", "Clarendon", "Monotype Sorts", "Alibi", "Bremen Bd BT", "mono", "News Gothic MT", "AvantGarde Bk BT", "chs_boot", "fantasy", "Palatino", "BernhardFashion BT", "Courier New", "CloisterBlack BT", "Scriptina", "Tahoma", "BernhardMod BT", "Virtual DJ", "Nokia Smiley", "Boulder", "Andale Mono IPA", "Belwe Lt BT", "Calligrapher", "Belwe Cn BT", "Tanseek Pro Arabic", "FuturaBlack BT", "Abadi MT Condensed", "Mangal", "Chaucer", "Belwe Bd BT", "Liberation Serif", "DomCasual BT", "Bitstream Vera Sans", "URW Gothic L", "GeoSlab703 Lt BT", "Bitstream Vera Sans Mono", "Nimbus Mono L", "Heather", "Antique Olive", "Clarendon Cn BT", "Amazone BT", "Bitstream Vera Serif", "Utopia", "Americana BT", "Map Symbols", "Bitstream Charter", "Aurora Cn BT", "CG Omega", "Lohit Punjabi", "Balloon XBd BT", "Akhbar MT", "Courier 10 Pitch", "Benguiat Bk BT", "Market", "Cursor", "Bodoni Bk BT", "Letter Gothic", "Luxi Sans", "Brush455 BT", "Sydnie", "Lohit Hindi", "Lithograph", "Albertus", "DejaVu LGC Serif", "Lydian BT", "Antique Olive Compact", "KacstArt", "Incised901 Bd BT", "Clarendon Extended", "Lohit Telugu", "Incised901 Lt BT", "GiovanniITCTT", "KacstOneFixed", "Folio XBd BT", "Edda", "Loma", "Formal436 BT", "Fine Hand", "Garuda", "Impress BT", "RefSpecialty", "Sazanami Mincho", "Staccato555 BT", "VL Gothic", "Hkmer OS", "WP BoxDrawing", "Clarendon Blk BT", "Droid Sans", "CommonBullets", "Sherwood", "Helvetica", "CopprplGoth Bd BT", "Smudger Alts LET", "BPG Rioni", "CopprplGoth BT", "Guitar Pro 5", "Estrangelo TurAbdin", "Dauphin", "Arial Tur", "English111 Vivace BT", "Steamer", "OzHandicraft BT", "Arial Cyr", "Futura Lt BT", "Liberation Sans Narrow", "Futura XBlk BT", "Candy Round BTN Cond", "GoudyHandtooled BT", "GrilledCheese BTN Cn", "GoudyOlSt BT", "Galeforce BTN", "Kabel Bk BT", "Sneakerhead BTN Shadow", "OCR-A BT", "Denmark", "OCR-B 10 BT", "Swiss921 BT", "PosterBodoni BT", "Arial (Arabic)", "Serifa BT", "FlemishScript BT", "Arial", "American Typewriter", "Arial Black", "Apple Symbols", "Arial Narrow", "AppleMyungjo", "Arial Rounded MT Bold", "Zapfino", "Arial Unicode MS", "BlairMdITC TT-Medium", "Century Gothic", "Cracked", "Papyrus", "KufiStandardGK", "Plantagenet Cherokee", "Courier", "Helvetica", "Baskerville Old Face", "Apple Casual", "Type Embellishments One LET", "Bookshelf Symbol 7", "Abadi MT Condensed Extra Bold", "Calibri", "Calibri Bold", "Calisto MT", "Chalkduster", "Cambria", "Franklin Gothic Book Italic", "Century", "Geneva CY", "Franklin Gothic Book", "Helvetica Light", "Gill Sans MT", "Academy Engraved LET", "MT Extra", "Bank Gothic", "Eurostile", "Bodoni SvtyTwo SC ITC TT-Book", "Tekton Pro", "Courier CE", "Maestro", "BO Futura BoldOblique", "Lucida Bright Demibold", "New", "AGaramond", "Charcoal", "DIN-Black", "Lucida Sans Demibold", "Stone Sans OS ITC TT-Bold", "AGaramond Italic", "Bickham Script Pro Regular", "Adobe Arabic Bold", "AGaramond Semibold", "Al Bayan Bold", "Doremi", "AGaramond SemiboldItalic", "Arno Pro Bold", "Casual", "B Futura Bold", "Frutiger 47LightCn", "Gadget", "HelveticaNeueLT Std Bold", "Frutiger 57Cn", "DejaVu Serif Italic Condensed", "Myriad Pro Black It", "Frutiger 67BoldCn", "Gentium Basic Bold", "Sand", "GillSans", "H Futura Heavy", "Liberation Mono Bold", "GillSans Bold", "Cambria Math", "Courier Final Draft", "HelveticaNeue BlackCond", "cursive", "Techno", "HelveticaNeue BlackCondObl", "Gabriola", "JazzText Extended", "HelveticaNeue BlackExt", "sans-serif", "Textile", "HelveticaNeue BlackExtObl fantasy", "HelveticaNeue BoldCond", "Palatino Linotype Bold", "HelveticaNeue BoldCondObl", "BIRTH OF A HERO", "HelveticaNeue BoldExt", "Bleeding Cowboys", "HelveticaNeue BoldExtObl", "ChopinScript", "HelveticaNeue ExtBlackCond", "LCD", "HelveticaNeue ExtBlackCondObl", "Myriad Web Pro Condensed", "HelveticaNeue HeavyCond", "Scriptina", "HelveticaNeue HeavyCondObl", "OpenSymbol", "HelveticaNeue HeavyExt", "Virtual DJ", "HelveticaNeue HeavyExtObl", "Guitar Pro 5", "HelveticaNeue LightCondObl", "Nueva Std", "HelveticaNeue ThinCond", "Chicago", "HelveticaNeue ThinCondObl", "Nueva Std Bold", "Brush Script MT", "Capitals", "Myriad Web Pro", "Avant Garde", "B Avant Garde Demi", "Nueva Std Bold Italic", "BI Avant Garde DemiOblique", "MaestroTimes", "Univers BoldExtObl", "APC Courier", "Myriad Web Pro Bold", "Liberation Serif", "Myriad Pro Light", "Carta", "DIN-Bold", "DIN-Light", "Myriad Web Pro Condensed Italic", "DIN-Medium", "Tekton Pro Oblique", "DIN-Regular", "AScore", "HelveticaNeue UltraLigCondObl", "Opus", "HelveticaNeue UltraLigExt", "Myriad Pro Light It", "HelveticaNeue UltraLigExtObl", "Opus Chords Sans", "HO Futura HeavyOblique", "Opus Japanese Chords", "L Frutiger Light", "VT100", "L Futura Light", "Helsinki", "LO Futura LightOblique", "Helsinki Metronome", "Myriad Pro Black", "New York", "O Futura BookOblique", "R Frutiger Roman", "Reprise", "TradeGothic", "Warnock Pro Bold Caption", "Univers 45 Light", "Warnock Pro", "XBO Futura ExtraBoldOblique", "Univers 45 LightOblique", "Liberation Mono", "Univers 55 Oblique", "UC LCD", "Univers 57 Condensed", "Warnock Pro Bold", "Univers ExtraBlack", "Warnock Pro Light Ital Subhead", "Univers LightUltraCondensed", "Matrix Ticker", "Univers UltraCondensed", "Fang Song"];
        var available_fonts = [];

        //fontet default të parazgjedhura.
        var default_fonts = ['serif', 'sans-serif', 'monospace'];

        // një pangram 
        var test_str = "The quick brown fox jumps over the lazy dog!";

        // a fixed size
        var size = '72px';

        var body = document.getElementsByTagName("body")[0];

        var default_widths = {};
        var default_heights = {};
        var test_span = document.createElement("span");

        test_span.style.fontSize = size;
        test_span.innerHTML = test_str;

        body.appendChild(test_span);

        // ruajmeë vlerat e offset të fonteve default.
        for (var font in default_fonts) {
            test_span.style.fontFamily = default_fonts[font];
            default_widths[default_fonts[font]] = test_span.offsetWidth;
            default_heights[default_fonts[font]] = test_span.offsetHeight;
        }

        // kontrollojmë prezencën e fonteve default tek matrica.
        for (var i = 0; i < fonts.length; i++) {
            var available = false;
            for (var font in default_fonts) {
                test_span.style.fontFamily = fonts[i] + ',' + default_fonts[font]; // using the fallback system of fontfamily
                var new_width = test_span.offsetWidth; // new width
                var new_height = test_span.offsetHeight; // new height
                // check if the font is available
                var is_available = (new_width !== default_widths[default_fonts[font]] || new_height !== default_heights[default_fonts[font]]);
                available = available || is_available;
            }
            if (available) {
                available_fonts.push(fonts[i]);
            }
        }
        body.removeChild(test_span);
        var retID = new String();
        retID = available_fonts;
        retID = retID.toString();
        return retID;
    }
	
// një funksion i gjeneruar për të hashuar funksione të gjata 
    String.prototype.hashCode = function() {
        var hash = 0,
            i, chr, len;
        if (this.length === 0)
			return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr = this.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Konvertim në 32bit integer
        }
        return hash;
    };

    var temp = new Object();
    var fingerprintObj = new Object();

    temp = fingerprint_browser();
    temp = fingerprint_browser();
    fingerprintObj.Browser = temp.strBrowser;
    fingerprintObj.numVersion = temp.numVersion;
    fingerprintObj.Canvas = fingerprint_canvas();
   // fingerprintObj.Canvas = fingerprintObj.Canvas.hashCode();
    
 
    fingerprintObj.fonts = fingerprint_fonts();
    fingerprintObj.fonts = fingerprintObj.fonts.hashCode();
 

    temp = fingerprint_display();
    fingerprintObj.colorDepth = temp.colorDepth;
    fingerprintObj.width = temp.width;
    fingerprintObj.height = temp.height;
    fingerprintObj.availWidth = temp.availWidth;
    fingerprintObj.availHeight = temp.availHeight;
    fingerprintObj.Java = fingerprint_java();
	
   fingerprintObj.timezone = fingerprint_timezone();
   /* fingerprintObj.MimeType = navigator.MimeType;
	    fingerprintObj.MimeType = navigator.MimeType.hashCode();
	
	alert(navigator.MimeType);
	*/

    temp = fingerprint_latency();
    fingerprintObj.requestTime = temp.requestTime;
    fingerprintObj.networkLatency = temp.networkLatency;



    temp = fingerprint_os();
    fingerprintObj.strOs = temp.strOS;
    fingerprintObj.strOSBits = temp.strOSBits;

    temp = fingerprint_language();
    fingerprintObj.strLang = temp.strLang;
    fingerprintObj.strBrLng = temp.strBrLng;
    fingerprintObj.strTypeUsrLng = temp.strTypeUsrLng;
    fingerprintObj.strTypeSysLng = temp.strTypeSysLng;



    fingerprintObj.buildID = navigator.buildID;
    if (fingerprintObj.buildID == undefined)
        fingerprintObj.buildID = "null";

    fingerprintObj.onLin = navigator.onLin;
    if (fingerprintObj.onLin == undefined)
        fingerprintObj.onLin = "null";
    fingerprintObj.pixelDepth = screen.pixelDepth;

    if (fingerprintObj.pixelDepth == undefined)
        fingerprintObj.pixelDepth = "null";
    fingerprintObj.deviceXDPI = screen.deviceXDPI;
    if (fingerprintObj.deviceXDPI == undefined)
        fingerprintObj.deviceXDPI = "null";
    fingerprintObj.deviceYDPI = screen.deviceYDPI;
    if (fingerprintObj.deviceYDPI == undefined)
        fingerprintObj.deviceYDPI = "null";
    fingerprintObj.systemYDPI = screen.systemYDPI;
    if (fingerprintObj.systemYDPI == undefined)
        fingerprintObj.systemYDPI = "null";
    fingerprintObj.updateInterval = screen.updateInterval;
    if (fingerprintObj.updateInterval == undefined)
        fingerprintObj.updateInterval = "null";

fingerprintObj.plugin=fingerprint_plugins();
fingerprintObj.plugin;

    return fingerprintObj;




}

window.onload=start();
