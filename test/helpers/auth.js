import { api } from './api.js';
import 'dotenv/config';


let tokenEmCache = null;
export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        tokenEmCache = await getToken(process.env.ADMIN_EMAIL, process.env.ADMIN_SENHA);
    }
    return `Bearer ${tokenEmCache}`;

}

// Faz login com as credenciais do aluno e devolve a resposta completa do login
// (status, token e dados do usuário logado) para o teste poder validar quem logou
export async function loginComoAluno(emailAluno, senhaAluno) {
    return api()
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({
            email: emailAluno,
            senha: senhaAluno
        });
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
