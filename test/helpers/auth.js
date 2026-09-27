import { api } from './api.js';
import 'dotenv/config';


let tokenEmCache = null;
export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        const loginResposta = await api()
            .post('/api/auth/login')
            .set('Accept', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA

            });

        tokenEmCache = loginResposta.body.token;
    }
    return `Bearer ${tokenEmCache}`;

}

export async function getToken(emailUser, passworUser) {

    const loginResposta = await api()
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({
            email: emailUser,
            senha: passworUser

        });

    return loginResposta.body.token;

}

