const yup = require("yup");

const createEmployeeScheme = yup.object().shape({
  email: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  isAdmin: yup.boolean().required()
});

module.exports = {
  createEmployeeScheme
};
