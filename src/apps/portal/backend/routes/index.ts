import { Router } from "express";
import { AlunosController } from "../controllers/alunosController";
import { ProfessoresController } from "../controllers/professoresController";
import { AuthController } from "../controllers/authController";
import { authMiddleware, requireOwnership, requirePerfil } from "../middleware/authMiddleware";

export function buildRoutes(
  alunosController: AlunosController,
  professoresController: ProfessoresController,
  authController: AuthController,
  jwtSecret: string
) {
  const router = Router();
  const auth = authMiddleware(jwtSecret);

  router.get("/health", (_, response) => response.json({ ok: true }));

  // Autenticação (pública)
  router.post("/auth/login", authController.login);

  // Rotas do aluno (requer token + perfil ALUNO + ownership)
  router.get("/alunos/:alunoId/disciplinas/atuais", auth, requirePerfil("ALUNO"), requireOwnership("alunoId"), alunosController.buscarDisciplinasAtuais);
  router.get("/alunos/:alunoId/disciplinas/concluidas", auth, requirePerfil("ALUNO"), requireOwnership("alunoId"), alunosController.buscarDisciplinasConcluidas);
  router.get("/alunos/:alunoId/disciplinas/:disciplinaId/situacao", auth, requirePerfil("ALUNO"), requireOwnership("alunoId"), alunosController.buscarSituacao);
  router.get("/alunos/:alunoId/disciplinas/:disciplinaId/notas", auth, requirePerfil("ALUNO"), requireOwnership("alunoId"), alunosController.buscarNotas);
  router.get(
    "/alunos/:alunoId/turmas/:turmaId/disciplinas/:disciplinaId/grafico-media",
    auth,
    requirePerfil("ALUNO"),
    requireOwnership("alunoId"),
    alunosController.buscarGraficoMedia
  );

  // Rotas do professor (requer token + perfil PROFESSOR + ownership)
  router.get("/professores/:professorId/vinculos", auth, requirePerfil("PROFESSOR"), requireOwnership("professorId"), professoresController.buscarVinculos);
  router.get("/professores/:professorId/vinculos/:vinculoId/alunos", auth, requirePerfil("PROFESSOR"), requireOwnership("professorId"), professoresController.buscarAlunosPorVinculo);
  router.post("/professores/:professorId/notas/p1", auth, requirePerfil("PROFESSOR"), requireOwnership("professorId"), professoresController.registrarP1);
  router.post("/professores/:professorId/notas/p2", auth, requirePerfil("PROFESSOR"), requireOwnership("professorId"), professoresController.registrarP2);
  router.post("/professores/:professorId/notas/p3", auth, requirePerfil("PROFESSOR"), requireOwnership("professorId"), professoresController.registrarP3);
  router.get(
    "/professores/:professorId/vinculos/:vinculoId/alunos-elegiveis-p3",
    auth,
    requirePerfil("PROFESSOR"),
    requireOwnership("professorId"),
    professoresController.buscarElegiveisP3
  );

  return router;
}
