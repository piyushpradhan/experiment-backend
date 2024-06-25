import { GeneralRequestModel } from "src/domain/entities/general";

export interface CreateValueUseCase {
  execute(general: GeneralRequestModel): Promise<void>;
}
