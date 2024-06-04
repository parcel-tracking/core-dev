import ICarrier from "../../domains/entities/interfaces/ICarrier"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"

export default interface ICarrierRepository {
  getCarriers?(): Promise<ILayerDTO<ICarrier[]>>
  getCarrier?(carrierId: string): Promise<ILayerDTO<ICarrier>>
}
