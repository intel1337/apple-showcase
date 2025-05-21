import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51QUAU5L15jTnrWVNBQWVqnvr0aBKK62rC3AjsMVZTH18a5M3mIOHBKhVwRuBb7pjTaC8TTkejhRinpFLH1qlfIJj00jjIc8oFU');
// ENV MARCHE PAS, LAISSER CLE EN DUR SUR REPO PRIVE
export async function createProduct(productData) {
    try {
        const stripeProduct = await stripe.products.create({
            name: productData.name,
            description: productData.description
        });

        const price = await stripe.prices.create({
            product: stripeProduct.id,
            unit_amount: Math.round(productData.price * 100), 
            currency: 'usd'
        });

        return { productId: stripeProduct.id, priceId: price.id };
    } catch (error) {
        console.error('Error creating Stripe product:', error);
        return null;
    }
}

export async function checkoutProduct(productId) {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: productId,
                quantity: 1
            }],
            mode: 'payment',
            success_url: 'http://localhost:5173/success',
            cancel_url: 'http://localhost:5173/cart'
        });
        
        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}