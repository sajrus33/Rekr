"use strict";
//                                   "global" variables

let setUp = {
    myLatitude: 50.0, myLongitude: 20.0, myMarkers: []
};
//                                     After DOM loaded run app()
window.addEventListener("DOMContentLoaded", app);
function app() {

    // DOM elements
    const btnShowModal = document.querySelector(".showModal");
    const btnSaveModal = document.querySelector(".save");
    const txtName = document.querySelector(".name");
    const txtDescribe = document.querySelector(".describe");
    const table = document.querySelector(".table__body");

    //                                   Check actual localization
    const showPosition = (position) => {
        setUp.myLatitude = position.coords.latitude;
        setUp.myLongitude = position.coords.longitude;
        console.log(setUp);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }


    // DOM elements LISTENERS
    btnSaveModal.addEventListener("click", () => {
        const name = txtName.value;
        const describe = txtDescribe.value;

        console.log(name, describe);
        createMarker(describe, name);
        btnShowModal.click();

    });



    const createMarker = (describe, name) => {
        // crerate marker and add desribe
        const marker = L.marker([setUp.myLatitude, setUp.myLongitude], {
            draggable: true,
            autoPan: true,
        }).addTo(map).bindPopup("<b>" + name + "</b>" + "<br>" + describe)
            .openPopup();;

        // add marker to array for later manipulate
        setUp.myMarkers.push(marker);
        const i = setUp.myMarkers.length - 1;



        // addEvent lister to created marker marker
        setUp.myMarkers[i].on('dragend', function (e) {
            // this function will set draged marker coord into setUp coord 
            getMarkerCoord(setUp.myMarkers[i]);
            // now setUp coord are actual draged one
            console.log(setUp);
            // get into right td in table to reload it
            console.log(table.childNodes[3].childNodes[1].innerText);
            // finally reload text content of the table
            table.childNodes[i + 3].childNodes[1].innerText = setUp.myLongitude;
            table.childNodes[i + 3].childNodes[2].innerText = setUp.myLatitude;

        });
        createTablePosition(name);

    };



    const createTablePosition = (name) => {
        const newPosition = document.createElement("tr");
        // td name
        const newName = document.createElement("td");
        newName.innerText = name;
        //td X
        const newX = document.createElement("td");
        newX.innerText = setUp.myLongitude;
        //td Y
        const newY = document.createElement("td");
        newY.innerText = setUp.myLatitude;

        // append all
        newPosition.appendChild(newName);
        newPosition.appendChild(newX);
        newPosition.appendChild(newY);
        // table global, DOM element
        table.appendChild(newPosition);
    }


















    //          ADD and init LEAFLET MAP

    // init map
    const map = L.map('mapid', {
        minZoom: 4,
    }).setView([setUp.myLatitude, setUp.myLongitude], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);



    //  add marker on map LISTENER
    map.on("click", (e) => {
        btnShowModal.click();
        getMarkerCoord(e);
    });



    // get marker coord
    const getMarkerCoord = (e) => {
        let coord;
        //if its creating new marker
        if (e.latlng) {
            coord = e.latlng.toString().split(',');
        }//if its changing position
        else if (e.getLatLng) {
            coord = e.getLatLng().toString().split(',');
        }
        setUp.myLatitude = coord[0].split('(')[1];
        setUp.myLongitude = coord[1].split(')')[0];
    };

};



