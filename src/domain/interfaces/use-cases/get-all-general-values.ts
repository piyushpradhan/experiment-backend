import { GeneralResponseModel } from "../../entities/general";

export interface GetAllValuesUseCase {
  execute(): Promise<GeneralResponseModel[] | null>;
}
