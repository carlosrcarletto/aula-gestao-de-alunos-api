import { api } from "../helpers/api.js";
import { expect } from "chai";
import { comTokenDeAdmin } from "../helpers/auth.js";
import { novoAluno } from "../factories/alunosFactory.js";
import { novaDisciplina } from "../factories/disciplinasFactory.js";
import { alunoUnico, disciplinaUnica } from "../helpers/dadosUnicos.js";
import testesDeMatriculas from "../fixtures/matricula.json" with { type: "json" };

describe("Matrícula de Aluno em Disciplina", () => {
  it("Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina", async () => {
    //Arrange (preparar)
    // Fazer login, cadastrar o aluno e cadastrar a disciplina
    // const loginResposta = await api()
    //     .post('/api/auth/login')
    //     .set('Content-Type', 'application/json')
    //     .send({
    //         email: process.env.ADMIN_EMAIL,
    //         senha: process.env.ADMIN_SENHA
    //     });
    // let tokenAdmin = loginResposta.body.token;

    const cadastroAlunoResposta = await api()
      .post("/api/admin/alunos")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(novoAluno());
    let alunoId = cadastroAlunoResposta.body.id;
    console.log(alunoId);
    console.log(cadastroAlunoResposta.status);

    const cadastroDisciplinaResposta = await api()
      .post("/api/admin/disciplinas")
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send(novaDisciplina());
    let disciplinaId = cadastroDisciplinaResposta.body.id;
    console.log(`id da disciplina: ${disciplinaId}`);
    console.log(`status code: ${cadastroDisciplinaResposta.status}`);

    const cadastroMatriculaResposta = await api()
      .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
      .set("Content-Type", "application/json")
      .set("Authorization", await comTokenDeAdmin())
      .send({
        alunoId: alunoId,
      });

    //act ( agir/Executar)
    // matricular aluno

    expect(cadastroMatriculaResposta.status).to.equal(201);
    expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
    expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
  });

  testesDeMatriculas.forEach((testeDeMatricula) => {
    it(testeDeMatricula.testTitle, async () => {
      const cadastroAlunoResposta = await api()
        .post("/api/admin/alunos")
        .set("Content-Type", "application/json")
        .set("Authorization", await comTokenDeAdmin())
        .send(alunoUnico(testeDeMatricula.dadosAluno));

      let alunoId = cadastroAlunoResposta.body.id;

      const cadastroDisciplinaResposta = await api()
        .post("/api/admin/disciplinas")
        .set("Content-Type", "application/json")
        .set("Authorization", await comTokenDeAdmin())
        .send(disciplinaUnica(testeDeMatricula.dadosDisciplina));

      const disciplinaId = cadastroDisciplinaResposta.body.id;

      const cadastroMatriculaResposta = await api()
        .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
        .set("Content-Type", "application/json")
        .set("Authorization", await comTokenDeAdmin())
        .send({
          alunoId: alunoId,
        });

      //act ( agir/Executar)
      // matricular aluno

      expect(cadastroMatriculaResposta.status).to.equal(
        testeDeMatricula.statusCodeEsperado,
      );

      expect(cadastroMatriculaResposta.body.alunoId).to.equal(alunoId);
      expect(cadastroMatriculaResposta.body.disciplinaId).to.equal(disciplinaId);
    });
  });
});
