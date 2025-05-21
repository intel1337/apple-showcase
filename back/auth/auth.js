import jwt from 'jsonwebtoken';
import { UserModel } from '../Models/UserModel.js';
import dbClientInstance from '../client.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fdsqjksdbfdsjfpbqdjfbsdjfj8342743827894234328';

// Générer un token
export function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}
// Authentification utilisateur
export function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next() // passe à la suite sans erreur
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}
// Vérifier si utilisateur est admin
export async function verifyAdmin(req, res, next) {
    try {
        const client = await dbClientInstance();
        const userModel = new UserModel(client);
        const user = await userModel.getUserById(req.userId);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }

        next(); // passe à la suite sans erreur
    } catch (err) {
        return res.status(500).json({ error: 'Error verifying admin status' });
    }
} 