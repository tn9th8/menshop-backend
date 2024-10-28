import * as bcrypt from 'bcrypt';
import { generateKeyPairSync, KeyPairSyncResult } from 'crypto';

// function hash password
export const hashPass = async (plain: string): Promise<string> => {
    const saltRounds = 14;
    return await bcrypt.hash(plain, saltRounds);
}

// function compare password and hashing
export const isMatchPass = async (password: string, hash: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

export const genKeyPair = () => {
    const { publicKey, privateKey }: KeyPairSyncResult<string, string> =
        generateKeyPairSync('rsa', {
            modulusLength: 1024,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });
    return { publicKey, privateKey };
}