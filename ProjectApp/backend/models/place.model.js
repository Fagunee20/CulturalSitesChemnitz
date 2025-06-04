import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: String,
  type: String,
  category: String,
  operator: String,
  website: String,
  wheelchair: String,
  wikidata: String,
  address: {
    city: String,
    street: String,
    postcode: String,
    housenumber: String,
  },
  cuisine: String,
  opening_hours: String,
  diet: {
    halal: String,
    kosher: String,
    vegan: String,
    vegetarian: String,
  },
  geometry: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  }
}, {
  strict: false  // 👈 Allow fields not explicitly defined in the schema
});

// Define indexes
placeSchema.index({ geometry: '2dsphere' });
placeSchema.index({ name: 1 });
placeSchema.index({ category: 1 });
placeSchema.index({ 'address.city': 1 });

const Place = mongoose.model('Place', placeSchema);

export default Place;
