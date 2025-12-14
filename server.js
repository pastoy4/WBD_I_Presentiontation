require('dotenv').config();
const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/submit-product', async (req, res) => {
    const { productName, categoryName, createdDate, price, qty, amount, description } = req.body;

    const message = `
📦 *New Product Created* 📦

*Product Name:* ${productName}
*Category:* ${categoryName}
*Date:* ${createdDate}
*Price:* $${price}
*Qty:* ${qty}
*Amount:* $${amount}
*Description:* ${description}
    `;

    try {
        const telegramUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;
        await axios.post(telegramUrl, {
            chat_id: process.env.CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        });
        res.status(200).json({ success: true, message: 'Notification sent to Telegram' });
    } catch (error) {
        console.error('Telegram Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ success: false, message: 'Failed to send notification' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
