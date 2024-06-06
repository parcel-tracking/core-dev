import CarrierUseCase from "../../../core/domains/usecases/CarrierUseCase"
import ICarrierUseCase from "../../../core/domains/usecases/interfaces/ICarrierUseCase"
import ICarrierDTO from "../../../core/dtos/interfaces/ICarrierDTO"
import ICarrierRepository from "../../../core/repositories/interfaces/ICarrierRepository"

const mockCarrierRepository = {
  getCarriers: jest.fn()
}

describe("CarrierUseCase", () => {
  let carrierUseCase: ICarrierUseCase

  beforeEach(() => {
    carrierUseCase = new CarrierUseCase(
      mockCarrierRepository as unknown as ICarrierRepository
    )
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test("should get carriers successfully", async () => {
    const carrierDTOs: ICarrierDTO[] = [
      {
        id: "carrier-id",
        no: 1,
        name: "Carrier Name",
        displayName: "Carrier Display Name",
        isCrawlable: true,
        isPopupEnabled: true,
        popupURL: "http://popup.url"
      }
    ]

    mockCarrierRepository.getCarriers.mockResolvedValue({
      isError: false,
      message: "",
      data: carrierDTOs
    })

    const result = await carrierUseCase.getCarriers()

    expect(mockCarrierRepository.getCarriers).toHaveBeenCalled()
    expect(result.isError).toBe(false)
    expect(result.data).toEqual(carrierDTOs)
  })

  test("should return error if getCarriers fails", async () => {
    mockCarrierRepository.getCarriers.mockResolvedValue({
      isError: true,
      message: "Error"
    })

    const result = await carrierUseCase.getCarriers()

    expect(mockCarrierRepository.getCarriers).toHaveBeenCalled()
    expect(result.isError).toBe(true)
    expect(result.message).toBe("Error")
  })
})
