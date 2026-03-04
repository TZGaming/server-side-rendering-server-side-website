import express from 'express'
import { Liquid } from 'liquidjs';


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Maak werken met data uit formulieren iets prettiger
app.use(express.urlencoded({ extended: true }))

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express());

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


const params = {
  'filter[uuid][_eq]': '2b106014-5926-4e19-9707-dc289f0cf526'
}

const apiURL = 'https://fdnd-agency.directus.app/items/snappthis_snapmap?fields=*.*&' + new URLSearchParams(params)
const snappMap = await fetch(apiURL)
const snappmapResJSON = await snappMap.json()


app.get('/', async function (request, response) {

  response.render('index.liquid', { snappmaps: snappmapResJSON.data })
})


app.get('/snapmap/:uuid', async function (request, response) {

  const apiURL = 'https://fdnd-agency.directus.app/items/snappthis_snap?filter[uuid][_eq]=' + request.params.uuid
  const snap = await fetch(apiURL)
  const snapResJSON = await snap.json()

  const userApiURL = 'https://fdnd-agency.directus.app/items/snappthis_user?filter[uuid][_eq]=' + snapResJSON.data[0].author
  const user = await fetch(userApiURL)
  const userResJSON = await user.json()

  response.render('snapdetail.liquid', { snap: snapResJSON.data[0], snappmap: snappmapResJSON.data, user: userResJSON.data[0]})
})


app.post('/', async function (request, response) {
  // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
  // Er is nog geen afhandeling van een POST, dus stuur de bezoeker terug naar /
  response.redirect(303, '/')
})

// Stel het poortnummer in waar Express op moet gaan luisteren
// Lokaal is dit poort 8000, als dit ergens gehost wordt, is het waarschijnlijk poort 80
app.set('port', process.env.PORT || 8000)

// Start Express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})