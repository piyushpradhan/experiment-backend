import { GeneralResponseModel } from "src/domain/entities/general";
import { GeneralRepository } from "src/domain/interfaces/repositories/general-repository";
import { GetAllValuesUseCase } from "src/domain/interfaces/use-cases/get-all-general-values";

export class GetAllValues implements GetAllValuesUseCase {
  generalRepository: GeneralRepository;
  constructor(generalRepository: GeneralRepository) {
    this.generalRepository = generalRepository;
  }

  async execute(): Promise<GeneralResponseModel[] | null> {
    return await this.generalRepository.getAllValues();
  }
}
