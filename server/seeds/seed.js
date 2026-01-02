import mongoose from 'mongoose'
import Campground from '../models/campground.js'
import User from '../models/user.js'
import { data as cities } from './cities.js'
import { places, descriptors } from './descriptions.js'
import {allAmenities} from './amenity.js'
import { authorBios } from './authorDesc.js'
import { sampleImages } from './sampleImages.js'
import dotenv from 'dotenv';

dotenv.config({path:'../.env'});
const URL=process.env.MONGO_URL;

mongoose.connect(URL)
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
    await User.deleteMany({})
    const user = new User({
        email: 'test@gmail.com',
        username: 'test',
        joined: new Date(),
        bio: 'I am a test user',
        phoneNum: '1234567890',
        role: 'host'
    })
    const registeredUser = await User.register(user, 'password')
    for (let i = 0; i < 100; i++) {
        const random = Math.floor(Math.random()*cities.length)
        const sample =`${cities[random].city} ${cities[random].state}`;
        const ind=[Math.floor(Math.random()*allAmenities.length),
            Math.floor(Math.random()*allAmenities.length),
            Math.floor(Math.random()*allAmenities.length)];

        const camp = new Campground({
            author: registeredUser._id,
            location:sample,
            campLocation: {
                type: 'Point',
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude,
                ]
            },
            price: Math.floor((Math.random()) * 1000 + 200),
            description:`This dataset is meant to be used with other datasets that have features like 
            country and city but no latitude/longitude. It is simply a list of cities in the world. Being 
            able to put cities on a map will help people tell their stories more effectively. Another 
            way to think about it is that you can use this make more pretty graphs!`,
            checkin: '14:00',
            checkout: '11:00',
            camprules: [
                'Quiet hours are from 10 PM to 7 AM.',
                'No open fires outside designated fire rings.',
                'Pets must be leashed at all times.'
            ],
            authorDesc:authorBios[Math.floor(Math.random()*50)],
            image: [
                sampleImages[Math.floor(Math.random() * sampleImages.length)],
                sampleImages[Math.floor(Math.random() * sampleImages.length)]
            ],
            name: `${descriptors[random % (descriptors.length)]} ${places[random % (places.length)]}`,
            amenity:[allAmenities[ind[1]],allAmenities[ind[0]],allAmenities[ind[2]]]
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