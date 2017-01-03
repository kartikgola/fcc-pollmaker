$('#twitterLogin').click(function(e){
    var win = window.open('/requestToken', '', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
    win.onbeforeunload = function(){
        alert('Done');
    } 
});