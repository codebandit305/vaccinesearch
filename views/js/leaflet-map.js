//assign


var start = [42.5, -75];
var setmarker = [0, 0];

var settings = {
    center: start,
    zoom: 7.5
}


const mymap = L.map('mapid', settings);

let chosenmarkers = [];
let circlesarray = [];



var blueicon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redicon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var blackicon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function chooseAddr(lat1, lng1) {
     var chosenmarkers = L.marker(setmarker, { icon: blackicon}, { title: "Your Marker" }).addTo(mymap);
     mymap.setView([lat1, lng1], 14);
     chosenmarkers.setLatLng([lat1, lng1]);
     lat = lat1.toFixed(8);
     lon = lng1.toFixed(8);
     chosenmarkers.bindPopup("Your Marker").openPopup();

     function getMeters(i) {
         return i * 1609.344;
     }

     var circlesarray = L.circle([lat1, lng1], {
         color: 'blue',
         fillColor: '#a1d6f7',
         fillOpacity: 0.5,
         radius: getMeters(1)
     }).addTo(mymap);

     const button = document.getElementById('clear');
     let deleteBool = false;


     button.addEventListener('click',()=>{
         let deleteBool = true;
         chosenmarkers.removeFrom(mymap);
         circlesarray.removeFrom(mymap);
     });

}


function myFunction(arr){
     var out = "<br />";
     var i;

     if(arr.length > 0){
         for(i = 0; i < arr.length; i++){
             out += "<div class='address' title='Show Location and Coordinates' onclick='chooseAddr(" + arr[i].lat + ", " + arr[i].lon + ");return false;'>" + arr[i].display_name + "</div><br />";
         }
         document.getElementById('addressresult').innerHTML = out;
     } else{
      document.getElementById('addressresult').innerHTML = "Sorry, no results...";
     }
}

function addr_search(){
     var inp = document.getElementById("addr");
     var xmlhttp = new XMLHttpRequest();
     var url = "https://nominatim.openstreetmap.org/search?format=json&limit=3&q=" + inp.value;
     xmlhttp.onreadystatechange = function() {
         if (this.readyState == 4 && this.status == 200){
             var myArr = JSON.parse(this.responseText);
             myFunction(myArr);
         }
     };
xmlhttp.open("GET", url, true);
xmlhttp.send();
}

//enter

var input = document.getElementById("addr");
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("test").click();
    }
});

fetch('https://www.vaccinesnearyou.com/api')
    .then(res => res.json())
    .then(res => {
        var data = {
                data: res,
                error: res.error || null,
                loading: false
        };

        var main_array = [];
        var url_array = [];
        var typeofvaccines_array = [];
        var carryvaccine_array = [];
        var appoinment_array = [];
        var provider_array = [];
        var address_array = [];
        var coords_array = [];

        for (i = 0; i < data.data['features'].length; i++) {
            main_array.push(data.data['features'][i]);
            url_array.push(data.data['features'][i]['properties']['url']);
            typeofvaccines_array.push(data.data['features'][i]['properties']['appointment_vaccine_types']);
            carryvaccine_array.push(data.data['features'][i]['properties']['carries_vaccine']);
            appoinment_array.push(data.data['features'][i]['properties']['appointments_available']);
            provider_array.push(data.data['features'][i]['properties']['provider_brand_name']);
            address_array.push(data.data['features'][i]['properties']['address']);
            coords_array.push(data.data['features'][i]['geometry']['coordinates']);
        }

        const dataset = {
            main           : main_array,
            coordinates    : coords_array,
            address        : address_array,
            provider       : provider_array,
            appoinments    : appoinment_array,
            carryvaccines  : carryvaccine_array,
            typeofvaccines : typeofvaccines_array,
            url            : url_array
        }

        L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                }).addTo(mymap);


        var markers = L.markerClusterGroup();
        for (var i = 0; i < dataset.main.length; i++) {
            //assign variables
            var marker;
            var marker_coordinates = dataset.coordinates[i];
            var vaccinesoutput;
            var appoinments;
            var address;
            var vaccinetypes;
            var title = '<div class="pop-container"><h3>Provider: ' + dataset.provider[i] + '</h3><h3>Appointments: ' + appoinments + '</h3><h3>Vaccines: ' + vaccinesoutput + '</h3><h3>Address: ' + address + '</h3><a href=' + dataset.url[i] + '><h3>Website: ' + dataset.url[i] + '</h3></a><h3>Vaccine Types: ' + vaccinetypes + '</h3></div>';



            //assign address
            if (dataset.address[i] == null) {
                address = "Unknown";
            } else {
                address = dataset.address[i];
            }


            if (dataset.typeofvaccines[i] == null) {
                vaccinetypes = 'None';
            } else if (dataset.typeofvaccines[i]['moderna'] == true) {
                vaccinetypes = "Moderna";
            } else if (dataset.typeofvaccines[i]['pfizer'] == true) {
                vaccinetypes = "Pfizer";
            } else if (dataset.typeofvaccines[i]['pfizer'] == true && dataset.typeofvaccines[i]['moderna'] == true) {
                vaccinetypes = "Pfizer, Moderna";
            }

            if(dataset.appoinments[i] == true && dataset.carryvaccines[i] == true) {
                appoinments = "Yes";
                vaccinesoutput = "Yes"
                var marker = L.marker(new L.LatLng(marker_coordinates[1], marker_coordinates[0]), { icon: blueicon}, { title: title });

            } else if(dataset.appoinments[i] == false || dataset.appoinments[i] == null && dataset.carryvaccines[i] == true) {
                appoinments = "No";
                vaccinesoutput = "Yes"
                var marker = L.marker(new L.LatLng(marker_coordinates[1], marker_coordinates[0]), { icon: redicon}, { title: title });
            }

            marker.bindPopup(title, {
                maxWidth: "auto"
            });

            markers.addLayer(marker);
        }

    markers.addLayer(marker);
    mymap.addLayer(markers);

});
