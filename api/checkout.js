const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { productName, unitAmount } = req.body;

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'jpy',
                        product_data: {
                            name: productName || 'Project NULL Service',
                        },
                        unit_amount: unitAmount || 50000,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${req.headers.origin}/?success=true`,
            cancel_url: `${req.headers.origin}/?canceled=true`,
        });

        res.status(200).json({ url: session.url });
    } catch (err) {
        console.error('Stripe Error:', err);
        res.status(err.statusCode || 500).json(err.message);
    }
};
