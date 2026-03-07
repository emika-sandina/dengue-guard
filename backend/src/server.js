import dotenv from 'dotenv';
import 'dotenv/config';

//import the express app
import app from './app.js';

const PORT = process.env.PORT || 5000;

//start the server and listen to incoming requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
