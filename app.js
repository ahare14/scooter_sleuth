const spinUrl = 'https://web.spin.pm/api/gbfs/v1/denver/free_bike_status'
const birdUrl = 'https://api.birdapp.com/bird/nearby?latitude=39.766271&longitude=-104.951056&radius=1000'
const lyftUrl = ''
const limeUrl = ''
const jumpUrl = 'https://den.jumpbikes.com/opendata/free_bike_status.json'

let spinScooters
getSpinScooter(spinUrl)
let jump
getJumpBike(jumpUrl)
let birdData
getBird()


function getSpinScooter(url) {
  fetch(url)
    .then(response => response.json())
    .then(result => getSpinArray(result))
    .catch(error => console.error(error))
}

function getSpinArray(result){
 spinScooters = result.data.bikes
 console.log(spinScooters);
}
function getJumpBike(url) {
  fetch(url)
    .then(response => response.json())
    .then(result => getJumpArray(result))
    .catch(error => console.error(error))
}

function getJumpArray(result){
 jump = result.data.bikes
 console.log(jump)
}

function getBird() {
  fetch(birdUrl, {
    "method": "GET",
    "headers": {
      "Authorization": "BIRD eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJBVVRIIiwidXNlcl9pZCI6ImRmNjEyMGRlLTJiZmUtNGM3NC04NDQ0LTNmYWM4YWYyNmFkOSIsImRldmljZV9pZCI6Ijc0ZmRiZWFhLWRhNmEtNGVjYi04OGJiLTBkOTYzYjk4NzFjYSIsImV4cCI6MTU5NzI1NDY5Nn0.J28q6XQsagW4ox4rjcWRWDKggUIwRQx5rytaUPTJ-1Y",
      "Device-id": "74fdbeaa-da6a-4ecb-88bb-0d963b9871ca",
      "App-Version": "4.41.0",
      "Location": "{\"latitude\":39.766271,\"longitude\":-104.951056,\"altitude\":500,\"accuracy\":100,\"speed\":-1,\"heading\":-1}"
    }})
    .then(function(response) {
      return response.json()
    })
    .then(function(result) {
      birdData = result["birds"]
      console.log(birdData)
    })
    .catch(function(err) {
      console.error(err)
    })
  }

// load window with map and time
window.addEventListener('load', loadMap)

function loadMap() {
  navigator.geolocation.getCurrentPosition(function(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    initMap(latitude, longitude)
    startTime()
  })
}

// dynamic time rendering
function startTime() {
  let today = new Date();
  let h
  if (today.getHours() <= 12) {
    h = today.getHours()
  } else {
    h = today.getHours() - 12
  }
  // let h = today.getHours();
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
    zoom: 16
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
let jumpIcon = document.querySelector(".jump-icon").style
let spinIcon = document.querySelector(".spin-icon").style
let birdIcon = document.querySelector(".bird-icon").style


// checkbox functions for each company
function spinCheck() {
  if (spinCheckBox.checked === false) {
    spinCheckBox.checked = true
    spinIcon.display = 'block'
    plotSpinScooters()
  } else  {
    spinCheckBox.checked = false
    spinIcon.display = 'none'
    removeSpinMarkers()
  }
}

function birdCheck() {
  if (birdCheckBox.checked === false) {
    birdCheckBox.checked = true
    birdIcon.display = 'block'
    plotBirdScooters()
  } else {
    birdCheckBox.checked = false
    birdIcon.display = 'none'
    removeBirdScooters()
  }
}

function jumpCheck() {
  if (jumpCheckBox.checked === false) {
    jumpCheckBox.checked = true
    jumpIcon.display = 'block'
    plotJumpBikes()
  } else {
    jumpCheckBox.checked = false
    jumpIcon.display = 'none'
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
      '<p><b>Cost</b>: $1 to start $.15 cents per min </p>'+
      `<input type="button" onclick="location.href='https://spinpm.wpengine.com';" value="Go For a Ride!" />`+
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
      `<input type="button" onclick="location.href='https://www.bird.co/';" value="Go For a Ride!" />`+
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
      `<input type="button" onclick="location.href='https://jump.com/';" value="Go For a Ride!" />`+
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


