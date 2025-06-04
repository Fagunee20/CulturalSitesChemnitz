const fs = require('fs');
const mongoose = require('mongoose');
const Place = require('./models/place.model.js');
require('dotenv').config();

async function importData() {
  await mongoose.connect(process.env.MONGO_URL);

  const data = JSON.parse(fs.readFileSync('./data/osm-cultural-sites.geojson', 'utf8'));
  const features = data.features;

  for (let feature of features) {
    const props = feature.properties;
    const geom = feature.geometry;

    await Place.create({
      name: props.name,
      category: props.tourism || props.amenity,
      geometry: geom,
      website: props.website,
      wheelchair: props.wheelchair,
      operator: props.operator,
      wikidata: props.wikidata,
      address: {
        city: props['addr:city'],
        street: props['addr:street'],
        postcode: props['addr:postcode'],
        housenumber: props['addr:housenumber'],
      },
    });
  }

  console.log('Import complete');
  process.exit(0);
}

importData().catch(err => {
  console.error(err);
  process.exit(1);
});
