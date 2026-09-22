import request from 'supertest';
import { expect } from 'chai';

describe('Login', () => {
    let token
    beforeEach(async () => {
        token = await getToken('admin@escola.com', 'admin123');
    })
    it('deve retornar 200 e um token quando o admin informar e-mail e senha corretos', async () => {


        // cadastrar o aluno

        const cadastrarAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Authorization', `Bearer ${token}`)
            .set('Accept', 'application/json')
            .send({
                nome: 'Aluno Teste',
                email: 'aluno.teste@teste.com',
                matricula: '123456',
                senha: 'senha123'
            });
        // validar que ele foi cadastrado

        expect(cadastrarAlunoResposta.status).to.equal(201);
        expect(cadastrarAlunoResposta.body.nome).to.equal('Aluno Teste')
        expect(cadastrarAlunoResposta.body.email).to.equal('aluno.teste@teste.com')
        expect(cadastrarAlunoResposta.body.matricula).to.equal('123456')

    });
})