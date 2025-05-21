import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// SEEDER CHATGPT AUTHORISE PAR MASSI !!

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your actual API endpoint
const API_URL = 'http://localhost:3000/seed-product';

async function seedProducts() {
  try {
    const filePath = path.join(__dirname, 'data', 'apple_products.json');
    console.log('📂 Reading file from:', filePath);
    
    const products = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`📦 Found ${products.length} products to seed`);

    for (const product of products) {
      try {
        console.log(`🔄 Seeding product: ${product.name}`);
        const response = await axios.post(API_URL, product);
        console.log(`✅ Posted: ${product.name} (ID: ${response.data.id || 'N/A'})`);
      } catch (productErr) {
        console.error(`❌ Error seeding product ${product.name}:`, productErr.response?.data || productErr.message);
      }
    }

    console.log('🎉 All products have been seeded.');
  } catch (err) {
    console.error('❌ Error in seeder:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
  }
}

seedProducts();
