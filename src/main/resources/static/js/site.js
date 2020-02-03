
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
    var redirectLink = window.location.protocol + "//" + window.location.host + window.location.pathname + '?date=' + selectedDate;
    if(selectedQuery===""){

    }
    else{
        redirectLink+='&name='+selectedQuery;
    }
    console.log('Redirecting to: ' + redirectLink);
    window.location.href = redirectLink;
};

/** Set date of datepicker from parameter or today and reloadPage if date changed*/
function initDateTimePicker(){
    inputDate=document.getElementById('datepicker');
    var requestDate = getRequestParam('date');
    if(requestDate == null){
        requestDate = new Date();
        var redirectLink = window.location.protocol + "//" + window.location.host + window.location.pathname + '?date='+formatDateToString(requestDate);
        console.log('Redirecting to: ' + redirectLink);
        window.location.href = redirectLink;
    }else{
        requestDate = formatDate(requestDate);
    }
    console.log("Date: "+requestDate);

    $('#datepicker').datepicker(
        { dateFormat: 'yy-mm-dd',
            onSelect: function(d,i) {
                if (d !== i.lastVal) {
                    reloadPage();
                }
            }
        });
    $('#datepicker').datepicker('setDate', requestDate);

    /*Init showtime pickers for new shows*/
    $(".showtimepicker").datetimepicker({
            format: 'HH:mm',
            defaultDate:new Date()
    }).on('dp.change', function(ev){
        /* Update input value (time) for form*/
        $(ev.target).find('input').attr('val',time_format(new Date(ev.date.valueOf())));
    });

};
function initFormSubmits(){
    $('.showform').submit(function(e){
        e.preventDefault();
        $.ajax({
            url:'/movies/shows',
            type:'post',
            data:this.serialize(),
            success:function(){
                //whatever you wanna do after the form is successfully submitted
            }
        });
    });
}
function formatDate(input) {
    var dateFormat = 'yyyy-mm-dd';
    var parts = input.match(/(\d+)/g),
        i = 0, fmt = {};
    dateFormat.replace(/(yyyy|dd|mm)/g, function(part) { fmt[part] = i++; });
    return new Date(parts[fmt['yyyy']], parts[fmt['mm']]-1, parts[fmt['dd']]);
};

function formatDateToString(date) {
        var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function time_format(d) {
    hours = format_two_digits(d.getHours());
    minutes = format_two_digits(d.getMinutes());
    return hours + ":" + minutes;
}

function format_two_digits(n) {
    return n < 10 ? '0' + n : n;
}

$(document).ready(function(){
    initDateTimePicker();
    setInitialQuery();
    //initFormSubmits();
});