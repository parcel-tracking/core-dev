import CarrierDTO from "../../dtos/CarrierDTO"
import LayerDTO from "../../dtos/LayerDTO"
import ICarrierDTO from "../../dtos/interfaces/ICarrierDTO"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"
import ICarrierRepository from "../../repositories/interfaces/ICarrierRepository"
import ICarrierUseCase from "./interfaces/ICarrierUseCase"

export default class CarrierUseCase implements ICarrierUseCase {
  private carrierRepository: ICarrierRepository

  constructor(carrierRepository: ICarrierRepository) {
    this.carrierRepository = carrierRepository
  }

  async getCarriers(): Promise<ILayerDTO<ICarrierDTO[]>> {
    if (typeof this.carrierRepository.getCarriers === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    const {
      isError,
      message,
      data: carriers
    } = await this.carrierRepository.getCarriers()

    if (isError) {
      return new LayerDTO({
        isError,
        message
      })
    }

    const carrierDTOs = carriers.map((entitiy) => {
      return new CarrierDTO({
        id: entitiy.id,
        no: entitiy.no,
        name: entitiy.name,
        displayName: entitiy.displayName,
        isCrawlable: entitiy.isCrawlable,
        isPopupEnabled: entitiy.isPopupEnabled,
        popupURL: entitiy.popupURL
      })
    })

    return new LayerDTO({
      data: carrierDTOs
    })
  }
}
