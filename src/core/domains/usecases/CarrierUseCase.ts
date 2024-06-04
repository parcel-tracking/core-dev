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

  async getCarriers(): Promise<ILayerDTO<ICarrier[] | ICarrierDTO[]>> {
    const { isError, message, data } =
      await this.carrierRepository.getCarriers()

    if (isError) {
      return new LayerDTO({
        isError,
        message
      })
    }

    const carriers = data.map((carrier: ICarrier | ICarrierDTO) => {
      if (this.isServer()) {
        return new CarrierDTO({
          id: carrier.id,
          no: carrier.no,
          name: carrier.name,
          displayName: carrier.displayName,
          isCrawlable: carrier.isCrawlable,
          isPopupEnabled: carrier.isPopupEnabled,
          popupURL: carrier.popupURL
        })
      } else {
        return new Carrier({
          id: carrier.id,
          no: carrier.no,
          name: carrier.name,
          displayName: carrier.displayName,
          isCrawlable: carrier.isCrawlable,
          isPopupEnabled: carrier.isPopupEnabled,
          popupURL: carrier.popupURL
        })
      }
    })

    return new LayerDTO({
      data: carriers
    })
  }

  protected isServer(): boolean {
    return typeof window === "undefined"
  }
}
