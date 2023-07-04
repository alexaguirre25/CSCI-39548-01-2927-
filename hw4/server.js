console.log('May Node be with you');

require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;


app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

  MongoClient.connect(process.env.MONGODB_URI).then(client => {

    const db = client.db('star-wars-quotes');
    const quotesCollection = db.collection('quotes');

    app.get('/',(request,response) => {
         
        db.collection('quotes').find().toArray()
        .then(results => {
            response.render('index.ejs', {quotes: results});
            console.log(results)
        })
        .catch(error => console.error(error));
    })


    app.post('/quotes', (request, response) => {
        quotesCollection.insertOne(request.body).then(result => {
            console.log(result)
            response.redirect("/");
          }).catch(error => console.error(error))
      });

      app.delete('/quotes', (request, response) => {
        quotesCollection.deleteOne(
          { name: request.body.name }
        )
          .then(result => {
            if (result.deletedCount === 0) {
              return response.json('No quote to delete')
            }
            res.json('Deleted Darth Vadar\'s quote')
          })
          .catch(error => console.error(error))
      })

  app.listen(3001, () => {
    console.log('listening on http://localhost:3001/');
  });
  }).catch(console.error);