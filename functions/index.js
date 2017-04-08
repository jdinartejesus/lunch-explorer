const functions = require('firebase-functions')
const admin = require('firebase-admin')
const GooglePlaces = require('googleplaces')
const { config } = require('./config')

admin.initializeApp(functions.config().firebase)

exports.getGooglePlacesDataByName = functions.database.ref('/restaurants/{restaurant}').onWrite(event => {
  const data = event.data
  const content = data.val()
  const googlePlaces = new GooglePlaces(config.GOOGLE_PLACES_API_KEY, config.GOOGLE_PLACES_OUTPUT_FORMAT)

  const parameters = {
    query: content.name,
    type: ['establishment', 'restaurant'],
    location: '52.499329, 13.417971',
    radius: 5000
  }
  googlePlaces.textSearch(parameters, (err, res) => {
    if (err) return console.log(err)

    const restaurant = res.results[0]
    googlePlaces.imageFetch({ photoreference: restaurant.photos[0].photo_reference }, (err, res) => {
      if (err) return console.log(err)

      data.ref.update({
        address: restaurant.formatted_address,
        rating: restaurant.rating,
        place_id: restaurant.place_id,
        photoURL: res
      })
    })
  })
})
