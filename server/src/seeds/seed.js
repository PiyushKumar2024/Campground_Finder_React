import mongoose from 'mongoose'
import Campground from '../models/campground.js'
import User from '../models/user.js'
import { data as cities } from './cities.js'
import { places, descriptors } from './descriptions.js'
import { allAmenities } from './amenity.js'
import { authorBios } from './authorDesc.js'
import { sampleImages } from './sampleImages.js'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
const URL = process.env.MONGO_URL;

mongoose.connect(URL)
    .then(() => {
        console.log('successfully connected with mongodb')
        console.log('yay')
    })
    .catch(err => {
        console.log('error in connection')
        console.log(err)
    })

// Unique, immersive descriptions for campgrounds
const campDescriptions = [
    "Nestled among towering pine trees, this campground offers a serene escape from city life. Wake up to birdsong, hike scenic trails, and spend evenings around a crackling campfire under a canopy of stars. The nearby river provides excellent fishing and swimming opportunities.",
    "Perched on a ridge overlooking a vast valley, this stunning campsite rewards visitors with panoramic sunrise views. The crisp mountain air and wildflower meadows create an unforgettable backdrop for your outdoor adventure. Well-maintained trails lead to hidden waterfalls.",
    "This lakeside retreat is a paradise for water lovers. Kayak across glassy waters at dawn, fish for trout in the afternoon, and watch the sun paint the sky in brilliant oranges and pinks as it sets behind the mountains. Sandy beaches provide perfect picnic spots.",
    "Deep in an ancient forest where sunlight filters through cathedral-like canopy, this wilderness campground feels like stepping into another world. Moss-covered boulders, fern-lined paths, and the distant call of owls create a magical atmosphere.",
    "Set against a dramatic coastal backdrop with crashing waves and towering sea cliffs, this rugged campground is perfect for the adventurous spirit. Tide pools teeming with life, whale watching opportunities, and spectacular sunsets make every moment special.",
    "A hidden gem tucked into a high-altitude meadow surrounded by snow-capped peaks. Wildflowers bloom in a riot of color during summer, while autumn transforms the landscape into a golden wonderland. Crystal-clear streams wind through the property.",
    "This desert oasis campground surprises visitors with its lush vegetation surrounding a natural spring. By day, explore red rock formations and ancient petroglyphs. By night, the lack of light pollution reveals the Milky Way in breathtaking clarity.",
    "Surrounded by rolling hills and ancient olive groves, this Mediterranean-style campground blends outdoor adventure with cultural richness. Nearby villages offer local cuisine and wine tasting, while hiking trails reveal stunning panoramic vistas.",
    "Situated at the edge of a pristine national park, this eco-friendly campground is a gateway to some of the world's most spectacular hiking. Dense rainforest trails lead to thundering waterfalls and natural swimming holes carved from volcanic rock.",
    "This riverside campground sits where two crystal-clear streams converge, creating natural swimming pools and gentle rapids perfect for tubing. Towering willows provide shade, and the gentle sound of flowing water is nature's perfect lullaby.",
    "Perched above the clouds in a high-altitude plateau, this remote campground offers solitude and perspective. Eagles soar overhead, and the vast, uninterrupted views stretch to the horizon. A truly transformative experience for those seeking quiet reflection.",
    "This tropical beachfront campground brings together palm-fringed shores and turquoise waters. Snorkel vibrant coral reefs just steps from your tent, enjoy fresh seafood, and fall asleep to the rhythmic sound of gentle waves lapping the shore.",
    "An enchanting forest campground where bioluminescent fungi glow softly at night and ancient trees form a natural cathedral. Morning mist creates an ethereal atmosphere, and the rich biodiversity makes every nature walk a discovery.",
    "Set in a volcanic landscape of dramatic craters and steaming geothermal vents, this unique campground offers an otherworldly experience. Natural hot springs provide warm soaks under the stars, while the surrounding terrain is a geologist's paradise.",
    "This alpine campground sits in a flower-filled bowl surrounded by glacial peaks. In summer, wildflower meadows attract butterflies and hummingbirds. In winter, the landscape transforms into a snow-covered wonderland perfect for snowshoeing.",
    "A historic campground nestled in a canyon carved by millions of years of river erosion. Layered rock walls tell the story of deep time, while the river at the canyon floor offers world-class kayaking and swimming in emerald pools.",
    "This sprawling savanna campground offers front-row seats to incredible wildlife. From your tent, observe herds of wild animals grazing at sunrise, and listen to the symphony of the bush as darkness falls. Expert-guided walks available daily.",
    "Tucked into a fjord with mirror-still waters reflecting snow-capped peaks, this Norwegian-inspired campground is pure magic. Midnight sun in summer and northern lights in winter make every season equally spectacular.",
    "A bamboo-shaded campground in the misty highlands, where terraced rice paddies cascade down hillsides and traditional culture is woven into every interaction. Wake to roosters crowing and the fragrance of tropical flowers.",
    "This clifftop campground commands views of an endless ocean stretching to the horizon. Paragliders launch from nearby slopes, dolphins play in the surf below, and coastal walks reveal hidden beaches accessible only on foot.",
    "Surrounded by towering sand dunes that shift and sculpt with the desert winds, this Saharan-inspired campground offers camel treks at sunset, traditional campfire feasts, and stargazing that will take your breath away.",
    "A rainforest canopy campground where elevated platforms bring you eye-level with exotic birds and monkeys. Zip-line between trees, bathe in waterfall pools, and experience the incredible biodiversity of the tropical forest.",
    "This vineyard-adjacent campground combines wine country elegance with outdoor adventure. Cycle through sun-drenched vineyards, enjoy wine-pairing dinners, and watch hot air balloons drift across the valley at dawn.",
    "Set on the shore of a glacial lake where icebergs calve in the distance and the water is an impossible shade of turquoise. Kayak among floating ice, hike to glacier overlooks, and experience nature at its most raw and powerful.",
    "A peaceful riverside campground in the heart of tea country, where terraced plantations climb misty hillsides. Morning fog burns off to reveal lush green valleys, and the aroma of fresh tea fills the mountain air."
];

const campRuleSets = [
    ['Quiet hours: 10 PM – 7 AM.', 'No open fires outside fire rings.', 'Pets must be leashed at all times.'],
    ['Leave no trace — pack out all trash.', 'Campfires permitted in designated areas only.', 'Respect wildlife: no feeding animals.'],
    ['Maximum 6 guests per site.', 'Generators off by 9 PM.', 'Store food in bear-proof containers.'],
    ['Check-in after 2 PM, check-out by 11 AM.', 'No glass containers near the water.', 'Firewood available for purchase on site.'],
    ['Drones prohibited within campground.', 'Quiet hours from 10 PM to 6 AM.', 'Bicycles must stay on designated trails.'],
    ['No cutting or damaging trees.', 'Campfires must be fully extinguished before leaving.', 'Children under 12 must be supervised near water.'],
];

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seed = async () => {
    await Campground.deleteMany()
    await User.deleteMany({})

    const user = new User({
        email: 'piyush@gmail.com',
        username: 'Piyush',
        joined: new Date(),
        bio: 'I am the owner of these campgrounds',
        phoneNum: '1234567890',
        role: 'host'
    })
    const registeredUser = await User.register(user, 'Piyush')

    // Create a second host for variety
    const user2 = new User({
        email: 'explorer@gmail.com',
        username: 'WildExplorer',
        joined: new Date(),
        bio: 'Passionate about sustainable camping and eco-tourism across the globe.',
        phoneNum: '9876543210',
        role: 'host'
    })
    const registeredUser2 = await User.register(user2, 'Explorer')

    const hosts = [registeredUser, registeredUser2];

    for (let i = 0; i < cities.length; i++) {
        const loc = cities[i];
        const locationStr = `${loc.city}, ${loc.state}`;

        // Pick 3-5 unique amenities
        const numAmenities = 3 + Math.floor(Math.random() * 3);
        const shuffled = [...allAmenities].sort(() => Math.random() - 0.5);
        const selectedAmenities = shuffled.slice(0, numAmenities);

        // Pick 2-3 unique images
        const numImages = 2 + Math.floor(Math.random() * 2);
        const shuffledImages = [...sampleImages].sort(() => Math.random() - 0.5);
        const selectedImages = shuffledImages.slice(0, numImages);

        const camp = new Campground({
            author: sample(hosts)._id,
            location: locationStr,
            campLocation: {
                type: 'Point',
                coordinates: [loc.longitude, loc.latitude]
            },
            price: Math.floor(Math.random() * 300 + 25), // $25 - $325 range
            description: campDescriptions[i % campDescriptions.length],
            checkin: sample(['13:00', '14:00', '15:00', '16:00']),
            checkout: sample(['10:00', '11:00', '12:00']),
            camprules: sample(campRuleSets),
            authorDesc: authorBios[Math.floor(Math.random() * Math.min(50, authorBios.length))],
            image: selectedImages,
            name: `${descriptors[i % descriptors.length]} ${places[i % places.length]}`,
            amenity: selectedAmenities
        })
        await camp.save()
    }
}

seed()
    .then(() => {
        console.log(`Database successfully seeded with ${cities.length} campgrounds from around the world!`)
        mongoose.connection.close()
    })
    .catch((err) => {
        console.log(err)
    })