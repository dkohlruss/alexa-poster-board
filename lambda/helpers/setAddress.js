const setAddress = function(addressObj) {
  console.log("SETTING ADDRESS...");
  let formattedAddress = '';

  if (addressObj.addressLine1) {
    formattedAddress += addressObj.addressLine1;
  }
  if (addressObj.addressLine2) {
    formattedAddress += ' ' + addressObj.addressLine2;
  }
  if (addressObj.addressLine3) {
    formattedAddress += ' ' + addressObj.addressLine3;
  }
  if (addressObj.districtOrCounty) {
    formattedAddress += ' ' + addressObj.districtOrCounty;
  }
  if (addressObj.stateOrRegion) {
    formattedAddress += ' ' + addressObj.stateOrRegion;
  }
  if (addressObj.city) {
    formattedAddress += ' ' + addressObj.city;
  }
  if (addressObj.countryCode) {
    formattedAddress += ' ' + addressObj.countryCode;
  }
  if (addressObj.postalCode) {
    formattedAddress += ' ' + addressObj.postalCode;
  }

  console.log(formattedAddress);
  return formattedAddress;
}

module.exports = setAddress;
