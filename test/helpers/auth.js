import { api } from './api.js';
import 'dotenv/config';


// Faz login na API e devolve a resposta completa (status, token e dados do usuário logado)
async function login(email, senha) {
    return api()
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({
            email: email,
            senha: senha
        });
}

// Login do Admin com o email e a senha do .env (Dotenv).
// A senha pode ser trocada para testar cenários de erro, como senha incorreta.
export async function loginComoAdmin(senhaAdmin = process.env.ADMIN_SENHA) {
    return login(process.env.ADMIN_EMAIL, senhaAdmin);
}

// Login do Aluno (Usuário) com as credenciais usadas no cadastro feito pelo admin
export async function loginComoAluno(emailAluno, senhaAluno) {
    return login(emailAluno, senhaAluno);
}

// Header Authorization do admin, reaproveitando o token entre os testes
let tokenEmCache = null;
export async function comTokenDeAdmin() {
    if (!tokenEmCache) {
        const loginResposta = await loginComoAdmin();
        tokenEmCache = loginResposta.body.token;
    }
    return `Bearer ${tokenEmCache}`;

}
