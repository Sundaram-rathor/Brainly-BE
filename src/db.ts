import mongoose, {Schema, model} from "mongoose";

try {
mongoose.connect('mongodb+srv://rathorsundaram50:ci5OZsMIdodASZ9a@cluster0.vopm2.mongodb.net/brainly')
    console.log('mongoose connected')
} catch (error) {
    console.log('error connecting mongoose')
}
const UserSchema = new Schema({
    username: {
        type : String,
        unique: true
    },
    password: {
        type: String
    }
})

const ContentSchema = new Schema({
    title: String,
    link: String,
    type: String,
    tag: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true , unique: true}
    
})


export const ContentModel = model('Content', ContentSchema)
export const UserModel = model('User', UserSchema)
export const LinkModel = model('Links', LinkSchema)