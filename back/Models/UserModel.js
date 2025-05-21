export class UserModel {
    constructor(client) {
        this.client = client;
    }



    async createUserTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email TINYTEXT UNIQUE NOT NULL,
                password TINYTEXT NOT NULL,
                name TINYTEXT NOT NULL,
                role ENUM('user', 'admin') DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await this.client.execute(query);
    }

    async createUser(email, hashedPassword, name, role = 'user') {
        const req = `
            INSERT INTO users (email, password, name, role)
            VALUES (?, ?, ?, ?)
        `
        const [result] = await this.client.execute(req, [email, hashedPassword, name, role]);
        return result;
    }

    async getUserByEmail(email) {
        const req = `
            SELECT * FROM users WHERE email = ?
        `
        const [rows] = await this.client.execute(req, [email]);
        return rows[0];
    }

    async getUserById(id) {
        const req = `
            SELECT id, email, name, role, created_at FROM users WHERE id = ?
        `
        const [rows] = await this.client.execute(req, [id]);
        return rows[0];
    }
} 