import { writable } from 'svelte/store';


const getterCart = () => {
    if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
        // ||
    }
    return [];
};

// initialisation du panier
export const cart = writable(getterCart()); // useEffect  react, cross component et 

if (typeof window != 'undefined') {
    cart.subscribe(value => {
        localStorage.setItem('cart', JSON.stringify(value));
    });
}


export const addToCart = (product) => {
    cart.update(items => {
        let found = false;
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === product.id) {
                items[i].quantity = (items[i].quantity || 1) + 1;
                found = true;
                break;
            }
        }
        if (!found) {
            product.quantity = 1;
            items.push(product);
        }
        
        return items;
    });
};

export const removeFromCart = (productId) => {
    cart.update(items => {
        const newItems = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].id !== productId) {
                newItems.push(items[i]);
            }
        }
        return newItems;
    });
};

export const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    cart.update(items => {
        const newItems = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === productId) {
                // Copy all properties manually
                const updatedItem = {
                    id: items[i].id,
                    name: items[i].name,
                    price: items[i].price,
                    image: items[i].image,
                    quantity: quantity
                };
                newItems.push(updatedItem);
            } else {
                newItems.push(items[i]);
            }
        }
        return newItems;
    });
};

export const clearCart = () => {
    cart.set([]);
}; 