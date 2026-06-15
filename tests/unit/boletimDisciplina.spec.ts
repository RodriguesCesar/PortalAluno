import assert from "node:assert/strict";
import test from "node:test";
import { BoletimDisciplina } from "../../src/Contexts/Boletim/domain/BoletimDisciplina";

test("deve manter CURSANDO sem P1/P2", () => {
  const boletim = new BoletimDisciplina("aluno-1", "turma-1", "disc-1");
  assert.equal(boletim.obterStatus(), "CURSANDO");
  assert.equal(boletim.calcularMediaFinal(), null);
});

test("deve marcar elegível para P3 quando média inicial < 6", () => {
  const boletim = new BoletimDisciplina("aluno-1", "turma-1", "disc-1");
  boletim.registrarP1(4);
  boletim.registrarP2(5);
  assert.equal(boletim.calcularMediaInicial(), 4.5);
  assert.equal(boletim.estaElegivelParaP3(), true);
  assert.equal(boletim.obterStatus(), "CURSANDO");
});

test("deve usar P3 com a maior nota base e aprovar se média >= 6", () => {
  const boletim = new BoletimDisciplina("aluno-1", "turma-1", "disc-1");
  boletim.registrarP1(4);
  boletim.registrarP2(5);
  boletim.registrarP3(8);
  assert.equal(boletim.calcularMediaFinal(), 6.5);
  assert.equal(boletim.obterStatus(), "APROVADO");
});
