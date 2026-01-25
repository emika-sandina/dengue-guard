let express=require('express');
let app=express();
let cors=require('cors')
app.use(cors());
app.use(express.json())
let {GoogleGenerativeAI}=require('@google/generative-ai');
const path=require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env') })

let genAI=new GoogleGenerativeAI(process.env.GEMINIKEY)
let model=genAI.getGenerativeModel({model:'gemini-2.5-flash'});

app.post('/ask',
    async(req,res)=>{
        let {input}=req.body;
        let data=await model.generateContent(input)
        let finalData=data.response.text()

        res.send({
            _status:true,
            _message:"Content Found",
            finalData
        })

    }
)

// Frontend Routing
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Start on port ${PORT}`);
})

// ✅ Export the app to be used by server.js
module.exports = app;