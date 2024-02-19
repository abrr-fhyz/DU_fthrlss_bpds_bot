import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { OpenAI } from "openai";

dotenv.config();
console.log(process.env.OPENAI_API_KEY);

//creating openai object using API key

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const application = express();
application.use(cors());
application.use(express.json());

// Defining response sending function

let allText = '';
const sendResponse = (res) => {
    res.status(200).send({
        bot: allText,
    });
};

//module to dictate how to process requests from frontend, and return them 

application.post("/", async (req, res) => {
    try {
        const question = req.body.question;
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", //model can be changed to suit the user's wants
            messages: [ 
                { role: "system", content: "You are a helpful assistant." }, 
                { role: "user", content: question }
            ], 
            temperature: 0.7, 
            max_tokens: 1000, 
            top_p: 1, 
            frequency_penalty: 0.5, 
            presence_penalty: 0,
        }); 

        console.log(response);
        const botResponse = response.choices[0].message.content;
        allText += botResponse;
        sendResponse(res);
        allText = '';
    } catch (error) {
        console.error(error);
        res.status(500).send(error || "An error occurred");
    }
});


//a second module that can be connected to another server.
//during use, this portion handled terminal outputs from another server and sent them to frontend

/*
application.post('/data', async (req, res) => {
    try {
        const inputText = req.body.data;
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo-preview", 
            messages: [ 
                { role: "system", content: "You are a helpful assistant." }, 
                { role: "user", content: inputText }
            ], 
            temperature: 0.7, 
            max_tokens: 1000, 
            top_p: 1, 
            frequency_penalty: 0.5, 
            presence_penalty: 0,
        }); 

        if (inputText.trim() !== '') {
            console.log('Input is ' + inputText);
            const botResponse = response.choices[0].message.content;
            //chatArray.push(botResponse);
            allText += botResponse;
        }
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send(error || "An error occurred");
    }
});
*/

//to validate that the server is operational

application.listen(8000, () => {
    console.log('Application is running.');
});
