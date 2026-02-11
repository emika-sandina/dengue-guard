// Import Google Gemini SDK
import { GoogleGenerativeAI } from '@google/generative-ai';

//create gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINIKEY);

//selects gemini model
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash'
});

//Exports the model to be used in controllers
export default model;
