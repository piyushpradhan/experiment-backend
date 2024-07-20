import { GeneralResponseModel } from "../../entities/general";

export interface GeneralRepository {
  getAllValues(): Promise<GeneralResponseModel[] | null>;
}
