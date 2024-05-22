const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const testSession = async (req, res) => {
    try {
        const { product_name, amount, email, quantity } = req.body;
        const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: product_name,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
        });

        res.json({ success: true, data: session });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ success: false, data: null, message: error.message });
    }
};

// Define the route
router.post('/create-checkout-session', testSession);

module.exports = router;
