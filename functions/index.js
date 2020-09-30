// const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
// var admin = require("firebase-admin");


var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://dip-gr8.firebaseio.com"
});

const db = admin.firestore();


app.get('/cat/:keyword', (req, res) => {
    (async () => {
        try {
            let query = db.collection('recommendation');
            let response = [];
            await query.get().then(querySnapshot => {
            let docs = querySnapshot.docs;
            for (let doc of docs) {
                const selectedItem = {
                    cat: doc.data().cat,
                    content: doc.data().content
                };
                response.push(selectedItem);
            }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
        })();
});

// create
app.post('/api/create', (req, res) => {
    (async () => {
        try {
          await db.collection('recommendation').doc('/' + req.body.id + '/')
              .create({cat: req.body.cat,content:req.body.content});
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
  });

exports.app = functions.https.onRequest(app);
