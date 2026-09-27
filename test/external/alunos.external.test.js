import { expect } from "chai";
import { api } from "../helpers/api.js";
import { comTokenDeAdmin } from "../helpers/auth.js";
import { novoAluno } from "../factories/alunosFactory.js";

describe("Cadastro de Aluno", () => {
  it("deve retornar 201 quando o admin cadastrar um novo aluno", async () => {
    // cadastrar o aluno
    const aluno = novoAluno();

    const cadastrarAlunoResposta = await api()
      .post("/api/admin/alunos")
      .set("Authorization", await comTokenDeAdmin())
      .set("Accept", "application/json")
      .send(aluno);

    // validar que ele foi cadastrado
    expect(cadastrarAlunoResposta.status).to.equal(201);
    expect(cadastrarAlunoResposta.body.nome).to.equal(aluno.nome);
    expect(cadastrarAlunoResposta.body.email).to.equal(aluno.email);
    expect(cadastrarAlunoResposta.body.matricula).to.equal(aluno.matricula);
    expect(cadastrarAlunoResposta.body).to.not.have.property("senha");
  });
});
