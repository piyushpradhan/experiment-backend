import { GeneralRequestModel } from "src/domain/entities/general";
import { GeneralRepository } from "src/domain/interfaces/repositories/general-repository";
import { CreateValueUseCase } from "src/domain/interfaces/use-cases/create-value-use-case";

export class CreateValue implements CreateValueUseCase {
  generalRepository: GeneralRepository;
  constructor(generalRepository: GeneralRepository) {
    this.generalRepository = generalRepository;
  }

  async execute(general: GeneralRequestModel): Promise<void> {
    await this.generalRepository.createValue(general);
  }
}
