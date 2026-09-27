import { api } from "../helpers/api.js";
import { expect } from "chai";
import { comTokenDeAdmin, loginComoAluno } from "../helpers/auth.js";
import { alunoUnico } from "../helpers/dadosUnicos.js";
import testesDeLoginDoAluno from "../fixtures/loginAluno.json" with { type: "json" };

describe("Login do Aluno cadastrado pelo Admin", () => {
  testesDeLoginDoAluno.forEach((testeDeLogin) => {
    it(testeDeLogin.testTitle, async () => {
      //Arrange (preparar)
      // Logar como admin e cadastrar o aluno
      const dadosAluno = alunoUnico(testeDeLogin.dadosAluno);

      const cadastroAlunoResposta = await api()
        .post("/api/admin/alunos")
        .set("Content-Type", "application/json")
        .set("Authorization", await comTokenDeAdmin())
        .send(dadosAluno);

      expect(cadastroAlunoResposta.status).to.equal(201);
      const alunoId = cadastroAlunoResposta.body.id;

      //Act (agir/executar)
      // Logar com o email do aluno cadastrado pelo admin
      const loginAlunoResposta = await loginComoAluno(dadosAluno.email, testeDeLogin.senhaDoLogin);

      //Assert (verificar)
      expect(loginAlunoResposta.status).to.equal(testeDeLogin.statusCodeEsperado);

      if (testeDeLogin.mensagemDeErroEsperada) {
        expect(loginAlunoResposta.body.error).to.equal(testeDeLogin.mensagemDeErroEsperada);
        expect(loginAlunoResposta.body).to.not.have.property("token");
      } else {
        expect(loginAlunoResposta.body).to.have.property("token");
        expect(loginAlunoResposta.body.usuario.id).to.equal(alunoId);
        expect(loginAlunoResposta.body.usuario.nome).to.equal(dadosAluno.nome);
        expect(loginAlunoResposta.body.usuario.email).to.equal(dadosAluno.email);
        expect(loginAlunoResposta.body.usuario.role).to.equal("aluno");
      }
    });
  });
});
