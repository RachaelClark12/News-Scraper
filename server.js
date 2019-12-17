const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models');
const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/womansday-scraper'
|| 'mongodb://heroku_l77rpg70:woodland12@ds253368.mlab.com:53368/heroku_l77rpg70/womansday-scraper'
, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

// Routes

// A GET route for scraping the website
  app.get('/scrape', async function (req, res) {
    const response = await axios.get('https://www.womansday.com/');
    const $ = cheerio.load(response.data);
    $('div.simple-item.grid-simple-item.grid-simple-item-last-tablet').each(function (i, element) {
      const result = {};
      result.title = $(this)
        .children('a.simple-item-title.item-title')
        .text()
      result.link = $(this)
        .children('a.simple-item-title.item-title')
        .attr('href');
      result.summary = $(this)
        .children('div.simple-item-dek.item-dek')
        .text();
      console.log(result);
      // console.log($(element));
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    res.send('Scrape Complete');
  });

  // Route for getting all Articles from the db
  app.get('/api/articles', async function (req, res) {
    try {
      const data = await db.Article.find({});
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: { name: err.name, message: err.message } });
    }
  });

  // Route for grabbing a specific Article by id, populate it with it's comment
  app.get('/api/articles/:id', async function (req, res) {
    try {
      const data = await db.Article.findOne({ _id: req.params.id })
        .populate('comment');
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: { name: err.name, message: err.message } });
    }
  });

  // Route for saving/updating an Article's associated comment
  app.post('/api/articles/:id', async function (req, res) {
    try {
      const dbComment = await db.Comment.create(req.body);
      const dbArticle = await db.Article.findOneAndUpdate({ _id: req.params.id }, { comment: dbComment._id }, { new: true });
      res.json(dbArticle);
    } catch (err) {
      res.status(500).json({ error: { name: err.name, message: err.message } });
    }
  });

  app.listen(PORT, function () {
    console.log('App running on http://localhost:%s', PORT);
  });