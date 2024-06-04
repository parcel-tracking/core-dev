import CarrierDTO from "../../../core/dtos/CarrierDTO"
import ICarrierDTO from "../../../core/dtos/interfaces/ICarrierDTO"
import ICarrierRepository from "../../../core/repositories/interfaces/ICarrierRepository"
import CarrierUseCase from "../../../core/domains/usecases/CarrierUseCase"
import ICarrierUseCase from "../../../core/domains/usecases/interfaces/ICarrierUseCase"
import Carrier from "../../../core/domains/entities/Carrier"
import ICarrier from "../../../core/domains/entities/interfaces/ICarrier"
import LayerDTO from "../../../core/dtos/LayerDTO"

describe("CarrierUseCase", () => {
  let carrierRepository: jest.Mocked<ICarrierRepository>
  let carrierUseCase: ICarrierUseCase

  beforeEach(() => {
    carrierRepository = {
      getCarriers: jest.fn(),
      getCarrier: jest.fn()
    } as jest.Mocked<ICarrierRepository>

    carrierUseCase = new CarrierUseCase(carrierRepository)
  })

  it("should get carriers", async () => {
    const carriers: ICarrier[] = [
      new Carrier({
        id: "abc",
        no: 1,
        name: "carrier123",
        displayName: "Carrier-Name",
        isCrawlable: true,
        isPopupEnabled: true,
        popupURL: "http://example.com"
      })
    ]
    const repoLayerDTO = new LayerDTO({ data: carriers })

    const carrierDTOs: ICarrierDTO[] = carriers.map((entitiy) => {
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
    const usecaseLayerDTO = new LayerDTO({ data: carrierDTOs })

    carrierRepository.getCarriers.mockResolvedValue(repoLayerDTO)

    const result = await carrierUseCase.getCarriers()

    expect(result).toStrictEqual(usecaseLayerDTO)
    expect(carrierRepository.getCarriers).toHaveBeenCalled()
  })
})
