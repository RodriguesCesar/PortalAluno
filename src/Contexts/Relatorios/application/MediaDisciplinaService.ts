import { IBoletimDisciplinaRepository } from "../../Boletim/domain/IBoletimDisciplinaRepository";
import { IdDisciplina, IdTurma } from "../../Shared/types";

export class MediaDisciplinaService {
  constructor(private readonly boletimRepository: IBoletimDisciplinaRepository) {}

  async recalcularMediaDaDisciplinaDaTurma(turmaId: IdTurma, disciplinaId: IdDisciplina): Promise<number | null> {
    const boletins = await this.boletimRepository.buscarPorTurmaDisciplina(turmaId, disciplinaId);
    const medias = boletins
      .map((item) => item.calcularMediaFinal())
      .filter((item): item is number => item !== null);

    if (medias.length === 0) {
      return null;
    }

    return Number((medias.reduce((acc, current) => acc + current, 0) / medias.length).toFixed(2));
  }
}
