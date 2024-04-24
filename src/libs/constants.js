const devices = {
  android: [
    {
      name: 'Pixel 7',
      identifier: 'pixel7',
      os: '13.0'.split(','),
      defaultOs: '13.0'
    },
    {
      name: 'Nexus 5',
      identifier: 'nexus5',
      os: '5.1,6.0,7.1,8.1,9.0,10.0,11.0'.split(','),
      defaultOs: '11.0'
    },
    {
      name: 'Pixel 4',
      identifier: 'pixel4',
      os: '10.0,11.0'.split(','),
      defaultOs: '11.0'
    },
    {
      name: 'Pixel 4XL',
      identifier: 'pixel4xl',
      os: '10.0,11.0,12.0'.split(','),
      defaultOs: '12.0'
    }
  ],
  ios: [
    {
      name: 'iPhone 15 Pro',
      identifier: 'iphone15pro',
      os: '17.0'.split(','),
      defaultOs: '17.0'
    },
    {
      name: 'iPhone 14 Pro',
      identifier: 'iphone14pro',
      os: '16.0,17.0'.split(','),
      defaultOs: '17.0'
    },
    {
      name: 'iPhone 13 Pro',
      identifier: 'iphone13pro',
      os: '15.0,16.0,17.0'.split(','),
      defaultOs: '17.0'
    }
  ]
}

// The wikipedia applications
const applications = {
  android: 'u3axx7l2xnq73yvarsku7bm7dy',
  ios: 'ar6uoq4tg7px7ducbwqebvcrcu'
}

/**
 * Helper function to get the application from a system
 * @param {string} system The system we will be selecting the application from
 * @returns {object} The object that represents the current application
 */
const getSelectedApplicationFromSystem = (system) => {
  return { publicKey: applications[system], os: system }
}

// Have the devices mapped by identifier
const deviceByIdentifier = Object.keys(devices).reduce((acc, key) => {
  devices[key].forEach((device) => (acc[device.identifier] = device))
  return acc
}, {})

// Have the list of versions os mapped by device identifier
const deviceOsByIdentifier = Object.keys(devices).reduce((acc, key) => {
  devices[key].forEach((device) => (acc[device.identifier] = device.os))
  return acc
}, {})

// Have the names of the devices by the identidier
const deviceNameByIdentifier = Object.keys(devices).reduce((acc, key) => {
  devices[key].forEach((device) => (acc[device.identifier] = device.name))
  return acc
}, {})

export {
  deviceNameByIdentifier,
  devices,
  deviceOsByIdentifier,
  deviceByIdentifier,
  applications,
  getSelectedApplicationFromSystem
}
