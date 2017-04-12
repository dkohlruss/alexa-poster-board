const setUserLocation = function(location) {
  console.log("SETTING USER LOCAITON");
  const radiusLat = 0.36; // Radius of ~50km from location.lat, at 40 latitude
  const radiusLng = 0.58; // Radius of ~50km from location.lng, at 40 latitude

  let lat = location.lat;
  let lng = location.lng;

  let northLat = lat + radiusLat;
  let southLat = lat - radiusLat;
  let eastLng = lng + radiusLng;
  let westLng = lng - radiusLng;

  return {
    north: northLat,
    south: southLat,
    east: eastLng,
    west: westLng
  };
};

module.exports = setUserLocation;
