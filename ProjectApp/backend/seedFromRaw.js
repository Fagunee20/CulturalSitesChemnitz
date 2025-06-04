import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Place from './models/place.model.js'; // Adjust path if needed

dotenv.config();

async function seedFromStoredGeoJSON() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const geojsonCollection = db.collection('Chemnitz'); // Replace with your actual collection name

    const geojsonDoc = await geojsonCollection.findOne({ _id: new mongoose.Types.ObjectId('683379428b09e14839ad70ab') });
    if (!geojsonDoc) throw new Error('GeoJSON document not found');

    const features = geojsonDoc.features;
    console.log(`📦 Found ${features.length} features`);

    await Place.deleteMany({});
    console.log('🧹 Cleared existing Place documents');

    // Allowed enum values for wheelchair fields
    const validWheelchairValues = ['yes', 'no', 'limited', 'designated'];

    // Helper to normalize wheelchair values to allowed enum or undefined
    function normalizeWheelchairValue(val) {
      if (!val) return undefined;
      const valLower = String(val).toLowerCase();
      return validWheelchairValues.includes(valLower) ? valLower : undefined;
    }

    // Clean strings and remove empty objects recursively
    function cleanAndRemoveEmpty(obj) {
      if (typeof obj !== 'object' || obj === null) return;

      for (const key of Object.keys(obj)) {
        const val = obj[key];

        if (typeof val === 'string') {
          const trimmed = val.trim();
          obj[key] = trimmed === '' ? undefined : trimmed;
        } else if (typeof val === 'object') {
          cleanAndRemoveEmpty(val);
          // Remove empty objects or objects with only undefined/null values
          if (
            val === null ||
            (Object.keys(val).length === 0) ||
            Object.values(val).every(v => v === undefined || v === null)
          ) {
            delete obj[key];
          }
        }
      }
    }

    let insertedCount = 0;

    for (const [i, feature] of features.entries()) {
      if (
        !feature.geometry ||
        feature.geometry.type !== 'Point' ||
        !Array.isArray(feature.geometry.coordinates) ||
        feature.geometry.coordinates.length !== 2
      ) {
        console.warn(`⚠️ Skipping invalid or non-Point geometry at index ${i}`);
        continue;
      }

      // Parse coordinates as numbers
      const coords = feature.geometry.coordinates.map(c => {
        const num = typeof c === 'number' ? c : parseFloat(c);
        return isNaN(num) ? null : num;
      });

      if (coords.includes(null)) {
        console.warn(`⚠️ Skipping invalid coordinate values at index ${i}`);
        continue;
      }

      const props = feature.properties || {};

      // Build placeData with conditional fields (skip null/undefined)
      const placeData = {
        name: props.name || 'Unnamed',
        type: props.tourism || props.amenity || props.museum || undefined,
        category: props.landuse || props.building || undefined,
        ...(props.operator ? { operator: props.operator } : {}),
        ...(props.website ? { website: props.website } : {}),
        ...(props.phone ? { phone: props.phone } : {}),
        wheelchair: normalizeWheelchairValue(props.wheelchair),
        toilets_wheelchair: normalizeWheelchairValue(props['toilets:wheelchair']),
        ...(props.wikidata ? { wikidata: props.wikidata } : {}),
        ...(props.wikipedia ? { wikipedia: props.wikipedia } : {}),
        ...(props['@id'] ? { osm_id: props['@id'] } : {}),
        ...(props['addr:city'] || props['addr:street'] || props['addr:postcode'] || props['addr:housenumber']
          ? {
              address: {
                ...(props['addr:city'] ? { city: props['addr:city'] } : {}),
                ...(props['addr:street'] ? { street: props['addr:street'] } : {}),
                ...(props['addr:postcode'] ? { postcode: props['addr:postcode'] } : {}),
                ...(props['addr:housenumber'] ? { housenumber: props['addr:housenumber'] } : {}),
              },
            }
          : {}),
        ...(props.cuisine ? { cuisine: props.cuisine } : {}),
        ...(props.opening_hours
          ? { opening_hours: props.opening_hours.replace(/["“”]/g, '').trim() }
          : {}),
        ...(props['diet:halal'] || props['diet:kosher'] || props['diet:vegan'] || props['diet:vegetarian']
          ? {
              diet: {
                ...(props['diet:halal'] ? { halal: props['diet:halal'] } : {}),
                ...(props['diet:kosher'] ? { kosher: props['diet:kosher'] } : {}),
                ...(props['diet:vegan'] ? { vegan: props['diet:vegan'] } : {}),
                ...(props['diet:vegetarian'] ? { vegetarian: props['diet:vegetarian'] } : {}),
              },
            }
          : {}),
        geometry: {
          type: 'Point',
          coordinates: coords,
        },
      };

      // Clean all strings and remove empty objects
      cleanAndRemoveEmpty(placeData);

      try {
        const place = new Place(placeData);
        await place.validate();

        await Place.create(placeData);
        insertedCount++;
      } catch (err) {
        const placeName = props.name || 'Unnamed';
        console.error(`❌ Validation failed at index ${i} for '${placeName}':`);
        if (err.name === 'ValidationError') {
          for (const [field, detail] of Object.entries(err.errors)) {
            console.error(`   ⛔ ${field}: ${detail.message}`);
          }
        } else {
          console.error(err);
        }
      }
    }

    console.log(`✅ Inserted ${insertedCount} valid Place documents.`);
  } catch (error) {
    console.error('🚨 Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedFromStoredGeoJSON();
