import express from "express";
import dbClientInstance from "./client.js";
import { ProductModel } from "./Models/ProductModel.js";
import { UserModel } from "./Models/UserModel.js";
import { generateToken, verifyToken, verifyAdmin } from "./auth/auth.js";
import bcrypt from "bcrypt";
import cors from "cors";
import { createProduct, stripe } from "./tripe/index.js";

const app = express();
// json et cors middleware
app.use(express.json(), cors());

const serverInstance = await dbClientInstance();
// check db connection
const [database] = await serverInstance.execute(`SELECT 1 + 1`);




const userClient = new UserModel(serverInstance);

// authentification utilisateur
app.post("/register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await userClient.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userClient.createUser(email, hashedPassword, name);
        
        const token = generateToken(result.insertId);
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
// login utilisateur
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const user = await userClient.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "No acount Found" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        const token = generateToken(user.id);
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Read pour client
app.get("/all-products", async (req, res) => {
    try {
        const client = await dbClientInstance();
        const newClient = new ProductModel(client);
        const data = await newClient.getAllProducts();
        res.json(data);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

app.get("/product/:id", async (req, res) => {
    try {
        const client = await dbClientInstance();
        const newClient = new ProductModel(client);
        const data = await newClient.getProductById(req.params.id);
        res.json(data);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});
// Protected route pour admin
app.post("/create-product", verifyToken, verifyAdmin, async (req, res) => {          
    try {
        const client = await dbClientInstance();
        const newClient = new ProductModel(client);
        if(!req.body.name || !req.body.description || !req.body.price){
            res.status(400).json({ error: "Missing Fields" });
            return;
        }
        const data = await newClient.createProduct(req.body);
        const stripeProduct = await createProduct(req.body);
        if(!stripeProduct){
            res.status(400).json({ error: "Product not created On Stripe" });
            return;
        }else{
            res.status(200).json({ message: "Product created successfully on Stripe" });
        }

        if(data.affectedRows === 0){
            res.status(400).json({ error: "Product not created" });
        }
        if(data.affectedRows === 1){
            res.status(200).json({ message: "Product created successfully" });
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
// Protected route pour admin

app.post("/update-product/:id", verifyToken, verifyAdmin, async (req, res) => {   
    try {
        const client = await dbClientInstance();
        const newClient = new ProductModel(client);
        if(!req.body.name || !req.body.description || !req.body.price){
            res.status(400).json({ error: "Missing Fields" });
            return;
        }
        const data = await newClient.updateProduct(req.params.id, req.body);
        if(data.affectedRows === 0){
            res.status(400).json({ error: "Product not updated" });
        }
        if(data.affectedRows === 1){
            res.status(200).json({ message: "Product updated successfully" });
        }
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});
// Protected route pour admin

app.delete("/delete-product/:id", verifyToken, verifyAdmin, async (req, res) => {   
    try {
        const client = await dbClientInstance();
        const newClient = new ProductModel(client);
        const data = await newClient.deleteProduct(req.params.id);
        if(data.affectedRows === 0){
            res.status(400).json({ error: "Product not deleted" });
            console.log("Product not deleted");
        }
        if(data.affectedRows === 1){
            res.status(200).json({ message: "Product deleted successfully" });
            console.log("Product deleted successfully");
        }
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

// Checkout route
app.post("/checkout", verifyToken, async (req, res) => {
    try {
        const { products } = req.body;
        
        if (!products || products.length === 0) {
            return res.status(400).json({ error: "No products provided" });
        }

        const session = await stripe.checkout.sessions.create({
            line_items: products.map(product => ({
                price_data: product.price_data,
                quantity: product.quantity
            })),
            mode: 'payment',
            success_url: 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url: 'http://localhost:5173/cart'
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Admin  route
app.get("/admin", verifyToken, verifyAdmin, async (req, res) => {
    try {
        const user = await userClient.getUserById(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }


        res.json({
            id: user.id,

            email: user.email,
            name: user.name,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Create admin user
app.post("/create-admin", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existingUser = await userClient.getUserByEmail(email);
        if (existingUser) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await userClient.client.execute(
                'UPDATE users SET password = ?, role = ? WHERE email = ?',
                [hashedPassword, 'admin', email]
            );
            return res.status(200).json({ message: "User updated to admin" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await userClient.createUser(email, hashedPassword, name, 'admin');
        
        const token = generateToken(result.insertId);
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
})

app.get("/api/stripe/session/:sessionId", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId, {
            expand: ['line_items']
        })
        res.json({
            id: session.id,
            amount_total: session.amount_total,
            payment_status: session.payment_status,
            customer_details: session.customer_details,
            line_items: session.line_items.data.map(item => ({
                description: item.description,
                amount_total: item.amount_total,
                quantity: item.quantity
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Profile route
app.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await userClient.getUserById(req.userId);
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            created_at: user.created_at
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Seeder endpoint (no auth required)
app.post("/seed-product", async (req, res) => {          
    try {
        const client = await dbClientInstance();
        const newClient = new ProductModel(client);
        if(!req.body.name || !req.body.description || !req.body.price){
            res.status(400).json({ error: "Missing Fields" });
            return;
        }
        const data = await newClient.createProduct(req.body);
        if(data.affectedRows === 0){
            res.status(400).json({ error: "Product not created" });
        }
        if(data.affectedRows === 1){
            res.status(200).json({ message: "Product created successfully", id: data.insertId });
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
    if(!database){
        console.log("Database is not connected");
        console.log("Database needs to be connected to run the server, check docker container logs");
        process.exit(0);
    }
    else{
        console.log("Database is connected");
        setTimeout(() => {
            server.close(() => {
                console.log('Serveur arrêté automatiquement après 5 secondes.');
                process.exit(0); 
            });
        }, 5000);
    }
});


