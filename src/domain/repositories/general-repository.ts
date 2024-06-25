import { GeneralRepository } from "../interfaces/repositories/general-repository";
import { GeneralDataSource } from "../../data/interfaces/data-sources/general-data-source";
import { GeneralRequestModel, GeneralResponseModel } from "../entities/general";

export class GeneralRepositoryImpl implements GeneralRepository {
  generalDataSource: GeneralDataSource
  constructor(generalDataSource: GeneralDataSource) {
    this.generalDataSource = generalDataSource;
  }

  async createValue(general: GeneralRequestModel): Promise<void> {
    await this.generalDataSource.create(general);
  }

  async getAllValues(): Promise<GeneralResponseModel[] | null> {
    const result = await this.generalDataSource.getAll();
    return result;
  }
}
