
var inputQuery;

function getRequestParam(p){
    return (window.location.search.match(new RegExp('[?&]' + p + '=([^&]+)')) || [, null])[1];
};

function setInitialQuery(){
    var requestName = getRequestParam('name');
    inputQuery=document.getElementById('movieQuery');
    if(requestName != null){
        requestName=decodeURIComponent(requestName);
        console.log('Searched for :'+ requestName)
        inputQuery.value=requestName;
    }
    inputQuery.addEventListener("keyup",function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            reloadPageForQuery();
            //document.getElementById("myBtn").click();
        }
    });
};

function reloadPageForQuery(){
    var selectedQuery = inputQuery.value;
    var redirectLink = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + selectedQuery;
    console.log('Redirecting to: ' + redirectLink);
    window.location.href = redirectLink;
};


$(document).ready(function(){
    //setPicker();
    setInitialQuery();
});