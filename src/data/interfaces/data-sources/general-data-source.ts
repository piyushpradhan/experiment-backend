import { GeneralRequestModel, GeneralResponseModel } from "src/domain/entities/general";

export interface GeneralDataSource {
  getAll(): Promise<GeneralResponseModel[] | null>;
  create(general: GeneralRequestModel): Promise<void>;
}
