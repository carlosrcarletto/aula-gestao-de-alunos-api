import request from 'supertest';
import { expect } from 'chai';
import app from '../../src/app.js';
import mongoose from 'mongoose';

describe('Matrícula de Aluno em Disciplina', () => {

    it.only('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {

        //Arrange (preparar)
        // Fazer login, cadastrar o aluno e cadastrar a disciplina
        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });
        let tokenAdmin = loginResposta.body.token;

        const cadastroAlunoResposta = await request('http://localhost:3000')
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'Ana Souza',
                email: 'ana.souza.1008@example.com',
                matricula: '6543218',
                senha: '123456'
            });
        let alunoId = cadastroAlunoResposta.body.id;
        console.log(alunoId)
        console.log(cadastroAlunoResposta.status)

        const cadastroDisciplinaResposta = await request('http://localhost:3000')
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                nome: 'Engenharia de Software',
                codigo: 'ES103',
                cargaHoraria: 60
            });
        let disciplinaId = cadastroDisciplinaResposta.body.id;
        console.log(`id da disciplina: ${disciplinaId}`)
        console.log(`status code: ${cadastroDisciplinaResposta.status}`)

        const cadastroMatriculaResposta = await request('http://localhost:3000')
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .send({
                alunoId: alunoId
            });

        //act ( agir/Executar)
        // matricular aluno

        expect(cadastroMatriculaResposta.status).to.equal(201);
        expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
        expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
    });
});