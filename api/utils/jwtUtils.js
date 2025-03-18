import jwt from 'jsonwebtoken';
import { encrypt } from '../lib/crypto.js';

let activeSecretKey = process.env.JWT_SECRET;


export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, activeSecretKey);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

export const rotateSecretKeys = () => {
  const newSecretKey = encrypt(Date.now().toString(36));
  return newSecretKey;
};
