const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { OpenAI, OpenAIApi } = require("openai");
const fs = require('fs');
const client = new Client();

const congfig = JSON.parse(fs.readFileSync('config.json'));
let { apiKey, SysContent, AIModel } = congfig; //mengambil apiKey, SysContent, dan AIModel dari config.json
const openai = new OpenAI({ apiKey: apiKey });



// pesan ketika client terhubung
client.once('ready', () => {
    console.log('Client is ready!');
});

// generate qr code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

//memulai client
client.initialize();

// baca pesan yang mengandung /cek dan balas pesan
client.on('message', async msg => {
    if (msg.body.includes('/cek')) {
        const prompt = msg.body.split(' ').slice(1).join(' '); //memisahkan pesan
        console.log(prompt);
        try {
            const gptResponse = await openai.chat.completions.create({
                messages: [{ role: "system", content: SysContent }, { role: "user", content: prompt }],
                model: AIModel, //model yang sudah di training
            });
            msg.reply(gptResponse.choices[0].message.content); //balas pesan
        } catch (error) {
            console.error('Error generating response from GPT:', error);
            msg.reply('Maaf, terjadi kesalahan dalam menghasilkan respons.');
        }
    }
});




