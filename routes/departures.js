var express = require('express');
var router = express.Router();
var request = require('request');
var parseString = require('xml2js').parseString;

var apiBaseUrl = 'http://api.irishrail.ie/realtime/realtime.asmx';

/* GET DART departures. */
router.get('/', function(req, res, next) {
    //callToDepartures();
    callToDepartures(function(response) {
        //console.log(response)
        res.json(response);
    });
});

//http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByCodeXML_WithNumMins?StationCode=DLERY&NumMins=20

function callToDepartures(callback) {
    request.get({
            url: apiBaseUrl + '/getStationDataByCodeXML_WithNumMins?StationCode=DLERY&NumMins=20',
            followAllRedirects: true,
            headers: {
                'Content-Type': 'text/xml'
            }
        },
        function(err, httpResponse, body){
            if (!err) {
                // console.log(httpResponse);
                //console.log(body);
                parseString(body, function (err, result) {
                    //console.dir(result);
                    var stationsObjData = result.ArrayOfObjStationData.objStationData;
                    var stations = stationsObjData.map(function (station) {
                        return {
                            StationFullname : station.Stationfullname,
                            StationCode : station.Stationcode,
                            Destination : station.Destination,
                            DueIn : station.Duein
                        }
                    });
                    //console.log(stations);
                    callback(stations);
                });
            }
            else {
                console.error(err);
            }
        });
}

module.exports = router;
