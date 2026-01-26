require('dotenv').config();

//import the express app
const app = require('./app');

const PORT = process.env.PORT || 5000;

//start the server and listen to incoming requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
