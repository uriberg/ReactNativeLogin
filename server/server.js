const bodyParser = require("body-parser"); //to be able to post requests body as json
const express = require('express');
const app = express();
app.use(express.json());
app.use(bodyParser.json());
const employeeRouter = require('./routes/employee');
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Control-Type, Authorization');
  next();
});

app.use(cors());
app.use(express.json());
app.use(employeeRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port})`);
});
