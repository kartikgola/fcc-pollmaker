
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
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

// setInterval(function(){
//         if ( getCookie('reload') == 'true' )
//             window.location.href = '/';
// }, 1000);

function oAuthTwitterCb(userData) {
    if (userData.userName !== '' && userData.userId !== '') {
        if (window.location.href.indexOf('logout') >= 0) {
            window.location.href = '/';
        } else location.reload(); // 
    }
}

$('#twitterLogin').click(function (e) {
    var twitterLgnWin = window.open('/requestToken', 'LoginWindow', 'width=470, height=500', false);
});
