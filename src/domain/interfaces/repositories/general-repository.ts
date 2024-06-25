import { GeneralRequestModel, GeneralResponseModel } from "../../entities/general";

export interface GeneralRepository {
  getAllValues(): Promise<GeneralResponseModel[] | null>;
  createValue(general: GeneralRequestModel): Promise<void>;
}
