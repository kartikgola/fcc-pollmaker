
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

setInterval(function(){
        if ( getCookie('reload') == 'true' )
            location.reload(); 
}, 1000);

$('#twitterLogin').click(function (e) {
    window.open('/requestToken', 'LoginWindow', 'width=470, height=600', false);
});


