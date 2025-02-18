import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { ContentModel, LinkModel, UserModel } from './db';
import  jwt  from 'jsonwebtoken';
import { Random } from './utils/util';
import { UserMiddleware } from './middleware/Usermiddleware';
import cors from 'cors'



const app = express();
const PORT = 3000;


app.use(express.json());
app.use((req, res, next) => {
    res.set({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "'Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token'",
    });

    next();
})


app.get('/',(req,res)=>{
    res.json({
        message:'home route !!!'
    })
})

app.post('/api/v1/signup', async (req, res) => {
    const {username, password} = req.body;
    console.log(username)
    try {
        await UserModel.create({
            username: username,
            password: password
        })

        res.json({
            message:'user successfully created '
        })

    } catch (error) {
        res.status(411).json({
            message: 'user already exists'
        })
    }
});


app.post('/api/v1/signin', async (req, res)=>{
    const {username, password} = req.body;

    const existingUser = await UserModel.findOne({username, password});
    const JWT_SECRET =  process.env.JWT_PASSWORD


    if(existingUser){
        const token = jwt.sign({
            id: existingUser._id
        }, JWT_SECRET)

        res.json({
            token
        })
    }else{
        res.status(403).json({
            message:'Incorrect credentials'
        })
    }
})

//user protected routes
app.post('/api/v1/content',UserMiddleware, async (req,res)=>{
    const {link, type , title} = req.body;

    await ContentModel.create({
        link,
        title,
        type,
        userId:req.userId,
        tag:[]
    })

    res.json({
        message:'content created !!!'
    })
})

app.get('/api/v1/content',UserMiddleware , async(req,res)=>{
    const contents = await ContentModel.find({
        userId: req.userId
    })

    res.json({
        message:'content retrived',
        contents
    })
})
app.delete('/api/v1/content',UserMiddleware, (req,res)=>{

})

//share routes
 app.post('/api/v1/brain/share', UserMiddleware, async (req,res)=>{
    const {share} = req.body;
    console.log('sharing is caring')
    const hash = Random(10)
    if(share){
       const link = await LinkModel.create({
            userId: req.userId,
            hash: hash
        })
        const user = await UserModel.findById(req.userId);


        res.json({
            message:"sharable link generated",
            hash: hash,
            username:user?.username
        })

    }else{
        await LinkModel.deleteOne({
            userId: req.userId
        })

        res.json({
        message:'sharable link removed '
        })
    }

    

 })

 app.get('/api/v1/brain/:shareLink', async (req,res)=>{
     const hash = req.params.shareLink

     const link = await LinkModel.findOne({
        hash
     })

     const user = await UserModel.findOne({
        _id: link?.userId
     })


     if(!user){
        res.json({
            message:'user not found for the given hash'
        })
        return;
     }

     const content = await ContentModel.find({
        userId: user._id
     })
     


     res.json({
        message:'data retrived',
        username: user.username,
        content:content
     })




 })


app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
