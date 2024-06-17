import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || '7b40cdb346628b49cfa28ec8daf6e10d6add3a88b0316ecfa0b7dac5e517debb');

export async function signToken(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(secret);
}

export async function verifyToken(token) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (e) {
        return null;
    }
}
