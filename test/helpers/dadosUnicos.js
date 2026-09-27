// Os dados dos arquivos JSON são fixos. Como email, matrícula e código da disciplina
// precisam ser únicos no banco, acrescentamos um sufixo diferente a cada execução
// para os testes poderem rodar quantas vezes forem necessárias.

function sufixoUnico() {
    return `${Date.now()}${Math.floor(Math.random() * 1000)}`;
}

export function alunoUnico(dadosAluno) {
    const sufixo = sufixoUnico();
    const [usuario, dominio] = dadosAluno.email.split('@');

    return {
        ...dadosAluno,
        email: `${usuario}.${sufixo}@${dominio}`,
        matricula: `${dadosAluno.matricula}${sufixo}`
    }
}

export function disciplinaUnica(dadosDisciplina) {
    return {
        ...dadosDisciplina,
        codigo: `${dadosDisciplina.codigo}${sufixoUnico()}`
    }
}
