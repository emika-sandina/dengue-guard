// Import required packages
let express=require('express');
let app=express();
let cors=require('cors')

app.use(cors());
app.use(express.json())

//Import google gemini AI and set the model
let {GoogleGenerativeAI}=require('@google/generative-ai');
const path=require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env') })

let genAI=new GoogleGenerativeAI(process.env.GEMINIKEY)
let model=genAI.getGenerativeModel({model:'gemini-2.5-flash'});

//API endpoint to handle requests
app.post('/ask',
    async(req,res)=>{
        let {input}=req.body;
        let data=await model.generateContent(input)
        //fetch the response
        let finalData=data.response.text()

        //Send response back to frontend
        res.send({
            _status:true,
            _message:"Content Found",
            finalData
        })

    }
)

const PORT = process.env.PORT;
//Start the server
app.listen(PORT,()=>{
    console.log(`Server Start on port ${PORT}`);
})

// Export the app to be used by server.js
module.exports = app;