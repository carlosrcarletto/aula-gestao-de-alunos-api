import { expect } from "chai";
import { loginComoAdmin } from "../helpers/auth.js";
import testesDeLoginDoAdmin from "../fixtures/loginAdmin.json" with { type: "json" };

describe("Login do Admin", () => {
  testesDeLoginDoAdmin.forEach((testeDeLogin) => {
    it(testeDeLogin.testTitle, async () => {
      //Arrange (preparar)
      // A senha correta vem do .env (Dotenv); os cenários de erro usam a senha do JSON
      const senha = testeDeLogin.usarSenhaDoEnv ? process.env.ADMIN_SENHA : testeDeLogin.senhaDoLogin;

      //Act (agir/executar)
      const loginAdminResposta = await loginComoAdmin(senha);

      //Assert (verificar)
      expect(loginAdminResposta.status).to.equal(testeDeLogin.statusCodeEsperado);

      if (testeDeLogin.mensagemDeErroEsperada) {
        expect(loginAdminResposta.body.error).to.equal(testeDeLogin.mensagemDeErroEsperada);
        expect(loginAdminResposta.body).to.not.have.property("token");
      } else {
        expect(loginAdminResposta.body).to.have.property("token");
        expect(loginAdminResposta.body.usuario.email).to.equal(process.env.ADMIN_EMAIL);
        expect(loginAdminResposta.body.usuario.role).to.equal("admin");
      }
    });
  });
});
