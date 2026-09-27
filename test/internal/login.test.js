import request from 'supertest';
import 'dotenv/config';
import app from '../../src/app.js';
import { expect } from 'chai';
import sinon from 'sinon';
import authService from '../../src/services/auth.service.js';


describe('login', () => {
    it('deve retornar 500 quando acontecer algum problema de conexao com o banco de dados', async () => {
        const authServiceMock = sinon.stub(authService, 'login');
        authServiceMock.throws(new Error('Erro de conexao com o banco de dados'));

        const loginResposta = await request(app)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL,
                senha: process.env.ADMIN_SENHA
            });

        expect(loginResposta.status).to.equal(500);
        expect(loginResposta.body.error).to.equal('Erro interno do servidor.');

        sinon.restore();

    });

});