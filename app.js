// document.addEventListener('DOMContentLoaded', () => {
//   const endPoint = 'http://localhost:3000/api/v1/users';
//   fetch(endPoint)
//     .then(res => res.json())
//     .then(json => console.log(json));
// });
const railsBackend = 'http://localhost:3000/users'
const spinUrl = 'https://web.spin.pm/api/gbfs/v1/denver/free_bike_status'
const birdUrl = 'https://api.bird.co/bird/nearby?latitude=39.766271&longitude=-104.951056&radius=1000'
const lyftUrl = ''
const limeUrl = ''
const jumpUrl = 'https://den.jumpbikes.com/opendata/free_bike_status.json'

// html elements
const spinButton = document.querySelector('.spinSwitch')
const birdButton = document.querySelector('#birdSwitch')
const jumpButton = document.querySelector('#jumpSwitch')
const dropdown = document.querySelector('.dropdown-content')
const submit = document.querySelector('#login')


// let spinScooters
// getSpinScooter(spinUrl)
// let jump
// getJumpBike(jumpUrl)
// let birdData
// getBird()
// let users = []
// getUserInfo(railsBackend)


// function getUserInfo(url) {
//   fetch(url)
//     .then(response => response.json())
//     .then(result => displayInfo(result))
//     .catch(error => console.error(error))
// }

// function displayInfo(result) {
//   console.log(result)
//   result.forEach(function(person){
//     users.push(person)
//     const a = document.createElement('a')
//     a.textContent = `${person.first_name} ${person.last_name}`
//     dropdown.appendChild(a)
//   })
// }

// function getSpinScooter(url) {
//   fetch(url)
//     .then(response => response.json())
//     .then(result => getSpinArray(result))
//     .catch(error => console.error(error))
// }

// function getSpinArray(result){
//  spinScooters = result.data.bikes
//  console.log(spinScooters);
// }
// function getJumpBike(url) {
//   fetch(url)
//     .then(response => response.json())
//     .then(result => getJumpArray(result))
//     .catch(error => console.error(error))
// }

// function getJumpArray(result){
//  jump = result.data.bikes
//  console.log(jump)
// }

// function getBird() {
//   fetch(birdUrl, {
//     "method": "GET",
//     "headers": {
//       "Authorization": "BIRD eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBVVRIIiwidXNlcl9pZCI6IjY4YzdjOTk4LTQzM2MtNDQyOS1iODVhLWJhYWIwNzgwOGY5NCIsImRldmljZV9pZCI6ImM2OWZkMTc0LTlmMzEtNDJjOS05M2EyLTU4ODU5OWI5MGFhMCIsImV4cCI6MTU5MjMzNzg0M30.jLHY2vEIovsapo8iYKCpcU6Fv5HZxt9o172Onq7KTj8",
//       "Device-id": "c69fd174-9f31-42c9-93a2-588599b90aa0",
//       "App-Version": "4.24.5",
//       "Location": "{\"latitude\":39.766271,\"longitude\":-104.951056,\"altitude\":500,\"accuracy\":100,\"speed\":-1,\"heading\":-1}"
//     }})
//     .then(function(response) {
//       return response.json()
//     })
//     .then(function(result) {
//       birdData = result["birds"]
//       console.log(birdData)
//     })
//     .catch(function(err) {
//       console.error(err)
//     })
//   }



// grabs map location
window.addEventListener('load', loadMap)

function loadMap() {
  navigator.geolocation.getCurrentPosition(function(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    initMap(latitude, longitude)
    startTime()
  })
}

function startTime() {
  let today = new Date();
  let h = today.getHours() - 12;
  let m = today.getMinutes();
  let s = today.getSeconds();
  m = checkTime(m);
  s = checkTime(s);
  document.getElementById('datetime').innerHTML =
  h + ":" + m + ":" + s;
  let t = setTimeout(startTime, 500);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}

// plots location
let map
let geocoder
function initMap(latitude,longitude) {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: latitude, lng: longitude},
    zoom: 12
  })
  geocoder = new google.maps.Geocoder;
}

// geocoder to take in coordinates and spit out an address
let address
function geocode(latlng){
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === 'OK') {
      address = ((results[0].formatted_address))
      console.log(address);
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  })
}

// checkbox for each company
let spinCheckBox = document.querySelector(".spinCheck")
let birdCheckBox = document.querySelector(".birdCheck")
let jumpCheckBox = document.querySelector(".jumpCheck")


// checkbox functions for each company
function spinCheck() {
  if (spinCheckBox.checked === false) {
    spinCheckBox.checked = true
    plotSpinScooters()
  } else  {
    spinCheckBox.checked = false
    removeSpinMarkers()
  }
}

function birdCheck() {
  if (birdCheckBox.checked === false) {
    birdCheckBox.checked = true
    plotBirdScooters()
  } else {
    birdCheckBox.checked = false
    removeBirdScooters()
  }
}

function jumpCheck() {
  if (jumpCheckBox.checked === false) {
    jumpCheckBox.checked = true
    plotJumpBikes()
  } else {
    jumpCheckBox.checked = false
    removeJumpBikes()
  }
}


let spinMarkers = []
function plotSpinScooters() {
  console.log('hello')
  spinScooters.forEach(function(scooter){
    // let latlng = {lat: scooter.lat, lng: scooter.lon}
    // geocode(latlng)
    let markerS
    let contentStringS = '<div id="content">'+
      '<h1 id="firstHeading" class="firstHeading">Spin</h1>'+
      '<div id ="bodyContent">'+
      `<p>coordinates: latitude: ${scooter.lat}, longitude: ${scooter.lon}</p>`+
      `<p>Address: ${address}</p>`+
      `<p>${scooter.bike_id}</p>`+
      '<p><b>Cost</b>: $1 per 30 mins </p>'+
      '<button id="link" onclick="loadContent()"> Go For a Ride! </button>'+
      '</div>'

    let spinInfowindow = new google.maps.InfoWindow({
      content: contentStringS,
      maxWidth: 200
    })
    markerS = new google.maps.Marker({
      position: new google.maps.LatLng(scooter.lat, scooter.lon),
      map: map,
      icon: 'https://i.imgur.com/8rpLmdm.png',
      animation: google.maps.Animation.DROP,
      title: 'Spin Scooter Info'
    })
    spinMarkers.push(markerS)
    markerS.addListener('click', function() {
      console.log('click')
      spinInfowindow.open(map, markerS)
    })
  })
}

function removeSpinMarkers() {
  spinMarkers.forEach(function(mark){
    console.log('click')
    mark.setMap(null)
    spinMarkers = []
  })
}
// bird scooter ploter
let birdMarkers = []
function plotBirdScooters() {
  birdData.forEach(function(scooter){
    // let latlng = {lat: scooter.location.latitude, lng: scooter.location.longitude}
    // geocode(latlng)
    let markerB
    let contentStringB = '<div id="content">'+
      '<h1 id="firstHeading" class="firstHeading">Bird</h1>'+
      '<div id ="bodyContent">'+
      `<p>Address: latitude: ${scooter.location.latitude}, longitude: ${scooter.location.longitude}</p>`+
      `<p>Address: ${address}</p>`+
      `<p>${scooter.id}</p>`+
      '<p><b>Cost</b>: $1 to Start $.25 per min </p>'+
      '<button id="link" onclick="loadContent()"> Go For a Ride! </button>'+
      '</div>'
    let birdInfowindow = new google.maps.InfoWindow({
      content: contentStringB,
      maxWidth: 200
    })
    markerB = new google.maps.Marker({
      position: new google.maps.LatLng(scooter.location.latitude, scooter.location.longitude),
      map: map,
      icon: 'https://i.imgur.com/vjwfGlu.png',
      animation: google.maps.Animation.DROP
    })
    birdMarkers.push(markerB)
    markerB.addListener('click', function() {
      console.log('click')
      birdInfowindow.open(map, markerB)
    })
  })
}

function removeBirdScooters() {
  birdMarkers.forEach(function(markB){
    console.log('click')
    markB.setMap(null)
    birdMarkers = []
  })
}

// jump bike ploter
let jumpMarkers = []
function plotJumpBikes() {
  jump.forEach(function(bike){
    let markerJ
    let contentStringJ = '<div id="content">'+
      '<h1 id="firstHeading" class="firstHeading">Jump</h1>'+
      '<div id ="bodyContent">'+
      `<p>Address: latitude: ${bike.lat}, longitude: ${bike.lon}</p>`+
      `<p>${bike.bike_id}</p>`+
      '<p><b>Cost</b>: $.25 per min </p>'+
      `<button id="link" onclick="loadContent()"> Go For a Ride! </button>`+
      '</div>'
    let jumpInfowindow = new google.maps.InfoWindow({
      content: contentStringJ,
      maxWidth: 200
    })
    markerJ = new google.maps.Marker({
      position: new google.maps.LatLng(bike.lat, bike.lon),
      map: map,
      icon: 'https://i.imgur.com/2Z46Omm.png',
      animation: google.maps.Animation.DROP
    })
    jumpMarkers.push(markerJ)
    markerJ.addListener('click', function() {
      jumpInfowindow.open(map, markerJ)
    })
  })
}

function removeJumpBikes() {
  jumpMarkers.forEach(function(markJ){
    console.log('click')
    markJ.setMap(null)
    jumpMarkers = []
  })
}

// dropdown.addEventListener('click', userLogin)
// const h1Welcome = document.querySelector('#welcome')
// let humanLocator = {}
// function userLogin (event) {
//   event.preventDefault()
//   const person = event.target.textContent
//   console.log(perons)
//   createHumanObj(person)
//   h1Welcome.textContent = `Welcome ${event.target.textContent.split(' ')[0]} Lets Sleuth!`
// }

// function loadContent() {
//   const x = document.querySelector('#firstHeading')
//   console.log(humanLocator)
// }

// function createHumanObj (person) {
//   users.forEach(function(individual){
//     if (person === `${individual.first_name} ${individual.last_name}`) {
//       humanLocator[individual.id] = `${individual.first_name} ${individual.last_name}`
//     } else {
//       alert('error you idiot')
//     }
//   })
// }

const spinScooters = [
      {
        "bike_id": "f1e6cdb5-bb2f-4cfe-9225-860a75436210",
        "lat": 39.76307,
        "lon": -105.00112,
        "vehicle_type": "scooter",
        "is_reserved": 0,
        "is_disabled": 0
      },
      {
        "bike_id": "c382b74d-61db-4025-9385-a5000bb5087f",
        "lat": 39.76288,
        "lon": -104.98838,
        "vehicle_type": "scooter",
        "is_reserved": 0,
        "is_disabled": 0
      },
      {
        "bike_id": "3860ce10-a0cd-4d4f-929b-1d35a2ef0a3e",
        "lat": 39.75495,
        "lon": -105.00187,
        "vehicle_type": "scooter",
        "is_reserved": 0,
        "is_disabled": 0
      },
      {
        "bike_id": "761c6a7e-095a-4360-af0c-0d8c4572c694",
        "lat": 39.75355,
        "lon": -104.99216,
        "vehicle_type": "scooter",
        "is_reserved": 0,
        "is_disabled": 0
      },
      {
        "bike_id": "52af5537-7a5b-4232-ae84-70877d6484d7",
        "lat": 39.75268,
        "lon": -104.99936,
        "vehicle_type": "scooter",
        "is_reserved": 0,
        "is_disabled": 0
      }]

const jump = [{
        "bike_id": "bike_90722",
        "name": "19401",
        "lon": -104.986985,
        "lat": 39.75803833333333,
        "is_reserved": 0,
        "is_disabled": 0,
        "jump_ebike_battery_level": "48%",
        "jump_vehicle_type": "bike"
      },
      {
        "bike_id": "bike_184853",
        "name": "32814",
        "lon": -104.990265,
        "lat": 39.74614666666667,
        "is_reserved": 0,
        "is_disabled": 0,
        "jump_ebike_battery_level": "35%",
        "jump_vehicle_type": "bike"
      },
      {
        "bike_id": "bike_90709",
        "name": "19403",
        "lon": -105.011435,
        "lat": 39.78386833333333,
        "is_reserved": 0,
        "is_disabled": 0,
        "jump_ebike_battery_level": "83%",
        "jump_vehicle_type": "bike"
      },
      {
        "bike_id": "bike_90628",
        "name": "18923",
        "lon": -104.99449333333334,
        "lat": 39.743338333333334,
        "is_reserved": 0,
        "is_disabled": 0,
        "jump_ebike_battery_level": "63%",
        "jump_vehicle_type": "bike"
      },
      {
        "bike_id": "bike_184401",
        "name": "08682",
        "lon": -104.97072333333334,
        "lat": 39.745691666666666,
        "is_reserved": 0,
        "is_disabled": 0,
        "jump_ebike_battery_level": "31%",
        "jump_vehicle_type": "bike"
      },
      {
        "bike_id": "bike_90657",
        "name": "19429",
        "lon": -104.99039333333333,
        "lat": 39.74109166666667,
        "is_reserved": 0,
        "is_disabled": 0,
        "jump_ebike_battery_level": "83%",
        "jump_vehicle_type": "bike"
      }]

const birdData = [
      {
          "id": "a28f062e-f6b7-40c7-9ca9-b834993bd5c4",
          "location": {
              "latitude": 39.754489,
              "longitude": -104.950055
          },
          "code": "",
          "captive": false,
          "battery_level": 78
      },
      {
          "id": "5b21630d-40e3-46ec-b562-0015b1955ef3",
          "location": {
              "latitude": 39.751144,
              "longitude": -104.948703
          },
          "code": "",
          "captive": false,
          "battery_level": 92
      },
      {
          "id": "876f67e5-441a-4282-92c7-585abf706c83",
          "location": {
              "latitude": 39.751058,
              "longitude": -104.948676
          },
          "code": "",
          "captive": false,
          "battery_level": 98
      },
      {
          "id": "d5d4d170-30c4-47e1-bccb-f6b912e9358b",
          "location": {
              "latitude": 39.770133,
              "longitude": -104.971596
          },
          "code": "",
          "captive": false,
          "battery_level": 52
      },
      {
          "id": "0f4518c6-37a1-444b-b5b6-a55a033fdd1e",
          "location": {
              "latitude": 39.766238,
              "longitude": -104.972948
          },
          "code": "",
          "captive": false,
          "battery_level": 27
      },
      {
          "id": "89715907-801b-4bd6-b89f-4dfe9dbebd43",
          "location": {
              "latitude": 39.766457,
              "longitude": -104.973205
          },
          "code": "",
          "captive": false,
          "battery_level": 55
      },
      {
          "id": "2ad760b8-a852-41fd-948d-7ae0e61d0486",
          "location": {
              "latitude": 39.766286,
              "longitude": -104.973262
          },
          "code": "",
          "captive": false,
          "battery_level": 29
      }]
