
const express = require('express');
const Employee = require('../models/employee');
const router = new express.Router();

const fs = require('firebase-admin');

const serviceAccount = require('../service-accounts/serviceAccountKey.json');

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount)
});

const db = fs.firestore();

router.get('/employees',async (req,res) => {
  const employees = db.collection('employees');
  const snapshot = await employees.get();
  let employeesList = [];
  snapshot.forEach(doc => {
    //console.log(doc.id, '=>', doc.data());
    employeesList.push(doc.data());
  });
  //console.log(employeesList);
  res.send(employeesList);
});

router.get('/employees/:id', async (req, res) => {
  console.log('getting');
  const employee = await db.collection('employees').doc(req.params.id);
  const snapshot = await employee.get();
  console.log('curr user: ' + snapshot.data().isAdmin);
  res.send(snapshot.data().isAdmin);
});

router.post('/employees', async (req, res) => {
  //console.log(req.body);
  const usersDb = db.collection('employees');
  //const user = new User(req.body)
  const user = usersDb.doc(req.body.email);

  try {
    await user.set({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      isAdmin: false
    });
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});


router.delete('/employees/:id', async (req, res) => {
  console.log(req.params.id);
  await db.collection('employees').doc(req.params.id).delete();
  res.status(201).send();
});

router.put('/employees/:id', async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  const employee = await db.collection('employees').doc(req.params.id).update({
    "first_name": req.body.first_name,
    "last_name": req.body.last_name
  });
  res.status(201).send();
});

module.exports = router;
