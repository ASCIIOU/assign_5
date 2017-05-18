var skycons = new Skycons();


skycons.add("today", Skycons.PARTLY_CLOUDY_DAY);
skycons.add("day1", Skycons.CLEAR_DAY);
skycons.add("day2", Skycons.CLOUDY);
skycons.add("day3", Skycons.RAIN);

skycons.play();

$('#dropdown li').on('click', function () {
    $("#city").text($(this).text());
    console.log(city);
    
    var url = getUrl($(this).text().substr(0, 3));

    $.getWeatherJSON(url, function (data) {
        if (data.query.results) {
            showOut(data)
        } else {
            console.info("reloading : ", url)
            retry(url, showOut)
        }
    });
});

function getUrl(city) {
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+city+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
    return url;
}

function retry(url,element) {

    $.getWeatherJSON(url, function (data) {

        if (data.query.results) {
            showOut(data,element)
        } else {
            console.info("reloading : ", url)
            retry(url,element)
        }
    })
}

$(document).ready(function () {

    $.getWeatherJSON(getUrl('taipei'),
        function (data) {
            if (data.query.results) {
                showOut(data)
            } else {
                console.info("reloading")
                retry(getUrl('taipei'))
            }
        });

    var $dropdown = $("#dropdown li a");
        var url = getUrl($(element).text());
});


function FturnC(FDeg) {
    return Math.round((FDeg - 32) * (5 / 9)).toString();
}

function showOut(data) {

    var degree = FturnC(data.query.results.channel.item.condition.temp);
    var lowDeg = FturnC(data.query.results.channel.item.forecast[1].low);
    var highDeg = FturnC(data.query.results.channel.item.forecast[1].high);    

    $(".temperature").text(degree);
    $(".date").text(data.query.results.channel.item.forecast[0].date +"/");
    $("#weather").text(data.query.results.channel.item.forecast[0].text);
    
    $("#tomorrow").text(data.query.results.channel.item.forecast[1].date);
    $("#ttomorrow").text(data.query.results.channel.item.forecast[2].date);
    $("#tttomorrow").text(data.query.results.channel.item.forecast[3].date);

    skycons.set("today", getCode(data.query.results.channel.item.forecast[0].code));
    skycons.set("day1", getCode(data.query.results.channel.item.forecast[1].code));
    skycons.set("day2", getCode(data.query.results.channel.item.forecast[2].code));
    skycons.set("day3", getCode(data.query.results.channel.item.forecast[3].code));

    $("#tTemp").text(lowDeg + "-" + highDeg);
    
    lowDeg = FturnC(data.query.results.channel.item.forecast[2].low);
    highDeg = FturnC(data.query.results.channel.item.forecast[2].high);
    $("#ttTemp").text(lowDeg + "-" + highDeg);

    lowDeg = FturnC(data.query.results.channel.item.forecast[3].low);
    highDeg = FturnC(data.query.results.channel.item.forecast[3].high);
    $("#tttTemp").text(lowDeg + "-" + highDeg);
}


function getCode(code) {
    switch (parseInt(code)) {

        case 19: case 32:
        case 34: case 36:
            return Skycons.CLEAR_DAY;
            break;

        case 25: case 31: case 33:
            return Skycons.CLEAR_NIGHT;
            break;

        case 28: case 30: case 44:
            return Skycons.PARTLY_CLOUDY_DAY;
            break;

        case 27: case 29:
            return Skycons.PARTLY_CLOUDY_NIGHT;
            break;

        case 21: case 26:
            return Skycons.CLOUDY;
            break;

        case 3: case 4: case 9:
        case 11: case 12: case 40: case 45:
            return Skycons.RAIN;
            break;

        case 5: case 6: case 10:
        case 17: case 18: case 35:
        case 37: case 38: case 39: case 47:
            return Skycons.SLEET;
            break;

        case 7: case 8: case 13:
        case 14: case 15: case 16:
        case 41: case 42: case 43: case 46:
            return Skycons.SNOW;
            break;

        case 0: case 1: case 2:
        case 23: case 24:
            return Skycons.WIND;
            break;

        case 20: case 22:
            return Skycons.FOG;
            break;

        default:
            console.log(code + " not available");
    }
}

