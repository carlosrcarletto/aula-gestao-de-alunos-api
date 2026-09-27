import { api } from "../helpers/api.js";
import { expect } from "chai";
import { comTokenDeAdmin, loginComoAluno } from "../helpers/auth.js";
import { alunoUnico, disciplinaUnica } from "../helpers/dadosUnicos.js";
import testesDeEntregaDeTrabalho from "../fixtures/entregaTrabalho.json" with { type: "json" };

describe("Entrega de Trabalho pelo Aluno", () => {
  testesDeEntregaDeTrabalho.forEach((testeDeEntrega) => {
    it(testeDeEntrega.testTitle, async () => {
      //Arrange (preparar)
      // Logar como admin, cadastrar o aluno e a disciplina e, se o cenário pedir, matricular o aluno
      const dadosAluno = alunoUnico(testeDeEntrega.dadosAluno);

      const cadastroAlunoResposta = await api()
        .post("/api/admin/alunos")
        .set("Content-Type", "application/json")
        .set("Authorization", await comTokenDeAdmin())
        .send(dadosAluno);

      expect(cadastroAlunoResposta.status).to.equal(201);
      const alunoId = cadastroAlunoResposta.body.id;

      const cadastroDisciplinaResposta = await api()
        .post("/api/admin/disciplinas")
        .set("Content-Type", "application/json")
        .set("Authorization", await comTokenDeAdmin())
        .send(disciplinaUnica(testeDeEntrega.dadosDisciplina));

      expect(cadastroDisciplinaResposta.status).to.equal(201);
      const disciplinaId = cadastroDisciplinaResposta.body.id;

      if (testeDeEntrega.matricularAluno) {
        const matriculaResposta = await api()
          .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
          .set("Content-Type", "application/json")
          .set("Authorization", await comTokenDeAdmin())
          .send({ alunoId });

        expect(matriculaResposta.status).to.equal(201);
      }

      // Logar com o email e a senha do aluno que o admin acabou de cadastrar
      const loginAlunoResposta = await loginComoAluno(dadosAluno.email, dadosAluno.senha);

      expect(loginAlunoResposta.status).to.equal(200);
      expect(loginAlunoResposta.body).to.have.property("token");
      expect(loginAlunoResposta.body.usuario.id).to.equal(alunoId);
      expect(loginAlunoResposta.body.usuario.email).to.equal(dadosAluno.email);
      expect(loginAlunoResposta.body.usuario.role).to.equal("aluno");

      const tokenDoAluno = `Bearer ${loginAlunoResposta.body.token}`;
      const idDoAlunoLogado = loginAlunoResposta.body.usuario.id;

      //Act (agir/executar)
      // O próprio aluno logado registra a entrega do trabalho, usando o token dele
      const entregaResposta = await api()
        .post(`/api/alunos/${idDoAlunoLogado}/trabalhos`)
        .set("Content-Type", "application/json")
        .set("Authorization", tokenDoAluno)
        .send({ disciplinaId, ...testeDeEntrega.dadosTrabalho });

      //Assert (verificar)
      expect(entregaResposta.status).to.equal(testeDeEntrega.statusCodeEsperado);

      if (testeDeEntrega.mensagemDeErroEsperada) {
        expect(entregaResposta.body.error).to.equal(testeDeEntrega.mensagemDeErroEsperada);
      } else {
        expect(entregaResposta.body.alunoId).to.equal(idDoAlunoLogado);
        expect(entregaResposta.body.disciplinaId).to.equal(disciplinaId);
        expect(entregaResposta.body.titulo).to.equal(testeDeEntrega.dadosTrabalho.titulo);
        expect(entregaResposta.body.status).to.equal("entregue");
      }
    });
  });
});
