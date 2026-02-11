//import gemini model from services
import model from "../services/gemini.service.js";

//controller function for chatbot
export const askChatbot = async (req, res) => {
  try {
    const { input } = req.body;

    //validate the input
    if (!input) {
      return res.status(400).json({
        _status: false,
        _message: "Input is required",
      });
    }

    //send the input to ai model
    const result = await model.generateContent(input);
    //Extract the response
    const finalData = result.response.text();

    //Send response to frontend
    res.json({
      _status: true,
      _message: "Content Found",
      finalData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      _status: false,
      _message: "Something went wrong",
    });
  }
};
