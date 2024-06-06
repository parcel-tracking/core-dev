import CarrierDTO from "../../dtos/CarrierDTO"
import LayerDTO from "../../dtos/LayerDTO"
import ICarrierDTO from "../../dtos/interfaces/ICarrierDTO"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"
import ICarrierRepository from "../../repositories/interfaces/ICarrierRepository"
import Carrier from "../entities/Carrier"
import ICarrier from "../entities/interfaces/ICarrier"
import ICarrierUseCase from "./interfaces/ICarrierUseCase"

export default class CarrierUseCase implements ICarrierUseCase {
  private carrierRepository: ICarrierRepository

  constructor(carrierRepository: ICarrierRepository) {
    this.carrierRepository = carrierRepository
  }

  async getCarriers(): Promise<ILayerDTO<ICarrierDTO[]>> {
    const { isError, message, data } =
      await this.carrierRepository.getCarriers()

    if (isError) {
      return new LayerDTO({
        isError,
        message
      })
    }

    const carriers = data.map((carrier: ICarrierDTO) => {
      return new Carrier({
        id: carrier.id,
        no: carrier.no,
        name: carrier.name,
        displayName: carrier.displayName,
        isCrawlable: carrier.isCrawlable,
        isPopupEnabled: carrier.isPopupEnabled,
        popupURL: carrier.popupURL
      })
    })

    const carrierDTOs = carriers.map((carrier: ICarrier) => {
      return new CarrierDTO({
        id: carrier.id,
        no: carrier.no,
        name: carrier.name,
        displayName: carrier.displayName,
        isCrawlable: carrier.isCrawlable,
        isPopupEnabled: carrier.isPopupEnabled,
        popupURL: carrier.popupURL
      })
    })

    return new LayerDTO({
      data: carrierDTOs
    })
  }
}
