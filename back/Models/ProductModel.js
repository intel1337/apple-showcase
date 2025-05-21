export class ProductModel{
    constructor(sqlClient){
        this.sqlClient = sqlClient;
        this.sqlClient.execute(`CREATE TABLE IF NOT EXISTS product(
            id INT PRIMARY KEY AUTO_INCREMENT,
            image TINYTEXT,
            name TINYTEXT,
            description TEXT,
            price FLOAT
        );`).catch(err => { console.error(err) });
    }
    async getAllProducts(){
        const [products] = await this.sqlClient.execute(`SELECT * FROM product`);
        return products;
    }
    async getProductById(id){
        const req = `SELECT * FROM product WHERE id =?`;
        const [products] = await this.sqlClient.execute(req, [id]);
        return products[0];
    }
    async createProduct(product){
        const { image, name, description, price } = product;
        const req = `INSERT INTO product (image, name, description, price) VALUES (?, ?, ?, ?)`;
        const [result] = await this.sqlClient.execute(
            req,
            [image, name, description, price]
        );
        return result;
    }
    async deleteProduct(id){
        const req = `DELETE FROM product WHERE id =?`;
        const [result] = await this.sqlClient.execute(req, [id]);
        return result;
    }
    async updateProduct(id, product){
        const { image, name, description, price } = product;
        const req = `UPDATE product SET image = ?, name = ?, description = ?, price = ? WHERE id = ?`;
        const [result] = await this.sqlClient.execute(req, [image, name, description, price, id]);
        return result;
    }
    
}