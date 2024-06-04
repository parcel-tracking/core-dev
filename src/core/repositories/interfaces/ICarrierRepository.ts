import ICarrier from "../../domains/entities/interfaces/ICarrier"
import ICarrierDTO from "../../dtos/interfaces/ICarrierDTO"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"

export default interface ICarrierRepository {
  getCarriers?(): Promise<ILayerDTO<ICarrier[] | ICarrierDTO[]>>
  getCarrier?(carrierId: string): Promise<ILayerDTO<ICarrier>>
}
