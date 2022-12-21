const express = require('express');
const mongoose= require('mongoose');
const path = require('path');
const Blog = require('./models/blog');
const bodyParser =require('body-parser');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'sdasjnjsfkjnfklenfnweifjiewijf@##@$%#!6%&(jiwjmjfc'
const dbURI = 'mongodb+srv://admin:LCRh9Xk9cKwJ55Sg@iiitl-blog.8saumch.mongodb.net/IIITL-db?retryWrites=true&w=majority';

mongoose.connect(dbURI, {  useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log(err));


    
const app = express();

app.use(bodyParser.json()) 
//static files
app.use(express.static('public'));

app.post('/api/change-password',  async(req, res) => {
    const { token, newpassword:plainTextPassword, cpassword:plainTextCPassword } = req.body

    if(!plainTextPassword) {
        return res.json({status: 'error', error: 'Invalid password' })
     }

    if(!plainTextCPassword) {
        return res.json({status: 'error', error: 'Invalid password' })
     }

    if(plainTextPassword !== plainTextCPassword) {
        return res.json({status: 'error', error: 'Passwords dont match' })
     }

    try {
    const user = jwt.verify(token , JWT_SECRET)
    const _id = user.id
    const hashedPassword = await bcrypt.hash(plainTextPassword, 10)

    await User.updateOne (
        { _id},
        {
            $set: { password: hashedPassword}
        }   
      )
       res.json({ status: 'ok' })
    } catch (error) {
        console.log(error)
        res.json({ status: 'error', error: 'Error!'  })
    }

})

app.post('/api/add-blog', async (req, res) => {
    res.redirect('/add-blog');
})

app.post('/api/save-blog', async (req, res) => {
    
      const {title, category, content} = req.body;   

      const blog = new Blog({
        title: title,
        category: category,
        content: content
    });

    console.log(req.body);
    
    blog.save()
        .then((result) => {
            res.send(result)
        })
        .catch((err) => { 
            console.log(err);
        });
})

app.post('/api/login', async (req, res) => {

    const { username , password } = req.body
    const user = await User.findOne({username}).lean()

    if(!user) {
        return res.json({ status:'error', error: 'Invalid username/password'})
    }

    if(await bcrypt.compare(password, user.password)) {
        //username password match
        const token = jwt.sign(
            {   id: user._id,
                username: user.username
            },
            JWT_SECRET
            )
            
            res.json({ status:'ok'})
    }
    else{
        res.json({ status: 'error', error: 'Invalid username/password' })
    }
    
})

app.post('/api/register', async (req, res) => {
    
     const { username, password: plainTextPassword , fullname, confirmpassword: plainTextCPassword } = req.body
     
     if(!username) {
        return res.json({status: 'error', error: 'Invalid username' })
     }

     if(!plainTextPassword) {
        return res.json({status: 'error', error: 'Invalid password' })
     }

     if(!plainTextCPassword) {
        return res.json({status: 'error', error: 'Invalid password' })
     }

     if(plainTextPassword !== plainTextCPassword) {
        return res.json({status: 'error', error: 'Passwords dont match' })
     }

     const password = await bcrypt.hash(plainTextPassword, 10)
     const confirmpassword = await bcrypt.hash(plainTextCPassword, 10)

    try {
        const response = await User.create({
            username,
            password,
            fullname,
            confirmpassword
        })
        console.log('User created: ', response)
    } catch(error) {
        if(error.code === 11000) {
            return res.json({ status: 'error', error: 'Username already in use'})
        }
        throw error
    }
    res.json({ status: 'ok' })
})


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.get('/', (req, res) => {
    res.render('index', { });
});

app.get('/about', (req, res) => {
    res.render('about', { });
});

app.get('/contact', (req, res) => {
    res.render('contact', { });
});

app.get('/single', (req, res) => {
    res.render('single', { });
});

app.get('/login', (req, res) => {
    res.render('login', { });
});

app.get('/signup', (req, res) => {
    res.render('signup', { });
});

app.get('/dashboard', (req, res) => {
    res.render('dashboard', { });
});

app.get('/user-dashboard', (req, res) => {
    res.render('user-dashboard', { });
});

app.get('/blog-view', (req, res) => {
    res.render('blog-view', { })
});

app.get('/add-blog', (req, res) => {
    res.render('add-blog', { })
});

app.get('/change-password', (req, res) => {
    res.render('change-password', { });
});



app.listen(3000, () => {
    console.log('Serving on port 3000')
})