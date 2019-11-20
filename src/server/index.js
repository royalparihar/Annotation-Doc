const express = require('express');
const mongoose = require('mongoose');
const compression = require('compression');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const TestDoc = require('./models/demo.js');

const app = express();

mongoose.Promise = global.Promise;
const mongoURL = 'mongodb+srv://royal:05L5qIgesWaXdyE6@mongo-free-cluster-0-8aqve.gcp.mongodb.net/test?retryWrites=true';
mongoose.connect(mongoURL, { useNewUrlParser: true }, (err) => {
  if (err) {
    console.log(`ERROR connecting to: ${mongoURL}, ${err}`);
    throw err;
  } else {
    console.log(`Succeeded connected to: ${mongoURL}`);
  }
});
app.use(compression());
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(express.static('dist'));
app.get('/api/getFile', (req, res) => {
  const filePath = './sample.txt';
  const file = path.join(__dirname, filePath);
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) res.status(500).send(err);
    TestDoc.findOne({ data }).exec((error, doc) => {
      if (error) res.status(500).send(err);
      if (!doc) {
        const demo = new TestDoc();
        demo.data = data;
        demo.words = data.split(' ').join('  ').split(' ');
        demo.save((error2) => {
          if (!error2) {
            res.json(demo);
          } else {
            res.status(500).send(error2);
          }
        });
      } else {
        res.json(doc);
      }
    });
  });
});
app.put('/api/saveSelection', (req, res) => {
  const { selectedValues, id } = req.body;
  TestDoc.findOne({ _id: id }).exec((err, doc) => {
    doc.selectedWords = selectedValues;
    doc.save((error, savedDoc) => {
      if (!error) {
        res.json(savedDoc.selectedWords);
      } else {
        res.status(500).send(err);
      }
    });
  });
});
app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));
