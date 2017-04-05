const setUserLocation = function(locationData) {

  const radiusLat = 0.36; // Radius of ~50km from location.lat, at 40 latitude
  const radiusLng = 0.58; // Radius of ~50km from location.lng, at 40 latitude

  let northLat = locationData.bounds.northeast.lat;
  let southLat = locationData.bounds.southwest.lat;
  let eastLng = locationData.bounds.northeast.lng;
  let westLng = locationData.bounds.southwest.lng;

  let latDifference = Math.abs(northLat - southLat);
  let lngDifference = Math.abs(eastLng - westLng);

  if (latDifference < (radiusLat * 2)) {
    // Prepare bounds for North and South boundary latitudes
      let northLat = locationData.location.lat + radiusLat;
      let southLat = locationData.location.lat - radiusLat;
  }

  if (lngDifference < (radiusLng * 2)) {
    let eastLng = locationData.location.lng - radiusLng;
    let westLng = locationData.location.lng + radiusLng;
  }

  console.log('setting location');
  return {
    north: northLat,
    south: southLat,
    east: eastLng,
    west: westLng
  };
};

module.exports = setUserLocation;
