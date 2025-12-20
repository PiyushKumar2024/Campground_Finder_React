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



const seed = async () => {
    await Campground.deleteMany()
    for (let i = 0; i < 100; i++) {
        const random = Math.floor(Math.random()*cities.length)
        const camp = new Campground({
            author:'693d1a84236fcf82f6fe7706',
            location: `${cities[random].city},${cities[random].state}`,
            price: Math.floor((Math.random()) * 1000 + 200),
            description: 'just a random campgrounds',
            image: `https://picsum.photos/400?random=${Math.random()}`,
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