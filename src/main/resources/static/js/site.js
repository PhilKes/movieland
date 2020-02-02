
var inputQuery,inputDate;

function getRequestParam(p){
    return (window.location.search.match(new RegExp('[?&]' + p + '=([^&]+)')) || [, null])[1];
};

/** Fill input search field from parameter + add Listener to Enter pressed in search field*/
function setInitialQuery(){
    inputQuery=document.getElementById('movieQuery');
    var requestName = getRequestParam('name');
    if(requestName != null){
        requestName=decodeURIComponent(requestName);
        console.log('Searched for :'+ requestName)
        inputQuery.value=requestName;
    }
    inputQuery.addEventListener("keyup",function(event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            reloadPage();
            //document.getElementById("myBtn").click();
        }
    });
};
/** Reload page with entered name queried*/
function reloadPage(){
    var selectedQuery = inputQuery.value;
    var selectedDate = inputDate.value;
    var redirectLink = window.location.protocol + "//" + window.location.host + window.location.pathname + '?name=' + selectedQuery+'&date=' + selectedDate;
    console.log('Redirecting to: ' + redirectLink);
    window.location.href = redirectLink;
};

/** Set date of datepicker from parameter or today and reloadPage if date changed*/
function setPicker(){
    inputDate=document.getElementById('datepicker');
    var requestDate = getRequestParam('date');
    if(requestDate == null){
        requestDate = new Date();
    }else{
        requestDate = formatDate(requestDate);
    }
    $('#datepicker').datepicker(
        { dateFormat: 'yy-mm-dd',
            onSelect: function(d,i) {
                if (d !== i.lastVal) {
                    reloadPage();
                }
            }
        });
    $('#datepicker').datepicker('setDate', requestDate);

};

function formatDate(input) {
    var dateFormat = 'yyyy-mm-dd';
    var parts = input.match(/(\d+)/g),
        i = 0, fmt = {};
    dateFormat.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
    return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
};

$(document).ready(function(){
    setPicker();
    setInitialQuery();
});