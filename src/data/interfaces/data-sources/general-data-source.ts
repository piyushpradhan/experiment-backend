import { GeneralRequestModel, GeneralResponseModel } from "src/domain/entities/general";

export interface IGeneralDataSource {
  getAll(): Promise<GeneralResponseModel[] | null>;
  create(general: GeneralRequestModel): Promise<void>;
}
