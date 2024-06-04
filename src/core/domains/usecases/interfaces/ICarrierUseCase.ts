import ICarrierDTO from "../../../dtos/interfaces/ICarrierDTO"
import ILayerDTO from "../../../dtos/interfaces/ILayerDTO"
import ICarrier from "../../entities/interfaces/ICarrier"

export default interface ICarrierUseCase {
  getCarriers(): Promise<ILayerDTO<ICarrier[] | ICarrierDTO[]>>
}
