const express = require('express');
const path = require('path');
const stripe = require('stripe')('YOUR_STRIPE_SECRET_KEY'); // Замените на ваш secret key

const app = express();

app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Простой эндпоинт для проверки работы сервера
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Сервер працює',
        timestamp: new Date().toISOString()
    });
});

// Эндпоинт для создания Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
    try {
        const { name, amount, comment } = req.body;
        
        console.log('Создание платежа:', { name, amount, comment });
        
        // Создаем Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // amount в центах
            currency: 'eur',
            metadata: {
                name: name,
                comment: comment || ''
            }
        });
        
        res.json({
            clientSecret: paymentIntent.client_secret
        });
    } catch (error) {
        console.error('Ошибка создания платежа:', error);
        res.status(500).json({ 
            error: 'Ошибка создания платежа',
            details: error.message 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущений на порту ${PORT}`);
    console.log(`🌐 Сайт: http://localhost:${PORT}`);
}); 