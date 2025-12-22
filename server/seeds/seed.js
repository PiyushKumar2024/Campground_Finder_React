import mongoose from 'mongoose'
import Campground from '../models/campground.js'
import { data as cities } from './cities.js'
import { places, descriptors } from './seedhelper.js'

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log('successfully connected with mongodb')
        console.log('yay')
    })
    .catch(err => {
        console.log('error in connection')
        console.log(err)
    })

const sampleImages = [
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362679/samples/landscapes/beach-boat.jpg', imageId: 'samples/landscapes/beach-boat' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362682/samples/landscapes/nature-mountains.jpg', imageId: 'samples/landscapes/nature-mountains' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362669/samples/landscapes/landscape-panorama.jpg', imageId: 'samples/landscapes/landscape-panorama' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362672/samples/landscapes/architecture-signs.jpg', imageId: 'samples/landscapes/architecture-signs' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362665/samples/landscapes/girl-urban-view.jpg', imageId: 'samples/landscapes/girl-urban-view' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362675/samples/animals/three-dogs.jpg', imageId: 'samples/animals/three-dogs' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362675/samples/animals/reindeer.jpg', imageId: 'samples/animals/reindeer' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362671/samples/people/bicycle.jpg', imageId: 'samples/people/bicycle' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362652/samples/people/kitchen-bar.jpg', imageId: 'samples/people/kitchen-bar' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362645/samples/chair.jpg', imageId: 'samples/chair' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg', imageId: 'sample' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362641/samples/sheep.jpg', imageId: 'samples/sheep' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362655/samples/people/jazz.jpg', imageId: 'samples/people/jazz' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362645/samples/food/spices.jpg', imageId: 'samples/food/spices' },
    { url: 'https://res.cloudinary.com/demo/image/upload/v1572362653/samples/food/fish-vegetables.jpg', imageId: 'samples/food/fish-vegetables' }
]

const seed = async () => {
    await Campground.deleteMany()
    for (let i = 0; i < 100; i++) {
        const random = Math.floor(Math.random()*cities.length)
        const camp = new Campground({
            author:'693d1a84236fcf82f6fe7706',
            location: `${cities[random].city},${cities[random].state}`,
            price: Math.floor((Math.random()) * 1000 + 200),
            description: 'just a random campgrounds',
            image: [
                sampleImages[Math.floor(Math.random() * sampleImages.length)],
                sampleImages[Math.floor(Math.random() * sampleImages.length)]
            ],
            name: `${descriptors[random % (descriptors.length)]} ${places[random % (places.length)]}`
        })
        await camp.save()
    }
}
seed()
.then(()=>{
    console.log('Data base successfully seeded')
    mongoose.connection.close()
})
.catch((err)=>{
    console.log(err)
})