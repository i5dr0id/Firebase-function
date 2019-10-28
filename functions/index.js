const functions = require('firebase-functions');
const admin = require('firebase-admin');
const uuidv5 = require('uuid/v5');
const namespace = require('uuid/v1')()

const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.getUsers = functions.https.onRequest(async (req,res) => {
	const eventref = admin.database().ref('/users');
	const snapshot = await eventref.once('value');
	const value = snapshot.val();
	return res.send(200, value);
})

exports.addNewUser = functions.https.onRequest(async (req, res) => {
	const user = req.body
	const snapshot = await admin.database().ref("/users").push(user)
	const value = snapshot;
	return res.send(200, value)
})

exports.UserCreated = functions.database.ref("/users/{pushID}").onCreate((snapshot, context) => {
    const pushID = context.params.pushID;
		const user = snapshot.val();
		const id = uuidv5(pushID, namespace);
    return snapshot.ref.update({ id });
  });