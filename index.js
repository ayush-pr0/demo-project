const express = require("express");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

const openAi = new OpenAIApi(
    new Configuration({
        apiKey: process.env.OPEN_AI_API_KEY,
    })
);

app.post("/healthgpt", async (req, res) => {
    try {
        const { prompt } = req.body;
        openAi
            .createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `${process.env.INIT_PROMPT}\n\nQuestion: ${prompt}`,
                    },
                ],
            })
            .then((response) => {
                return res.status(200).json({
                    success: true,
                    msg: response.data.choices[0].message.content,
                });
            });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: error.response
                ? error.response.data
                : "There in an issue with the server",
        });
    }
});

// app.use(express.static(`${__dirname}/static/`));
app.get("/", (req, res) => {
    res.render("index", {});
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
    // openAiInit();
    console.log(`Server listening on port ${port}`);
});
