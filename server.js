const express = require('express')
const res = require('express/lib/response')
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
  useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    try{
        const shortUrls = await ShortUrl.find();
        res.render('index', { shortUrls: shortUrls });
    }catch(err){
        console.log("error in fetching all shortened urls!!");
        res.status(500);
    }
})

app.post('/shortUrls', async (req, res) => {
    try{
        await ShortUrl.create({ full: req.body.fullUrl });
        res.redirect('/');
    }catch(err){
        console.log("error in creating short urls!!");
        return res.status(404);
    }
  
})

app.get('/:shortUrl', async (req, res) => {
    try{
        const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
        if (shortUrl == null) return res.sendStatus(404)

        shortUrl.clicks++;
        shortUrl.save();

        res.redirect(shortUrl.full);
    }catch(err){
        console.log("error in redirecting from short urls!");
        return res.status(400);
    }
})

app.listen(process.env.PORT || 5000, (err)=>{
    if(err){
        console.log("error starting up server");
        return res.status(500);
    }
    console.log("server started!");
    return res.status(200);
});