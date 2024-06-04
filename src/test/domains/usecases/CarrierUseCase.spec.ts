import Carrier from "../../../core/domains/entities/Carrier"
import ICarrier from "../../../core/domains/entities/interfaces/ICarrier"
import CarrierUseCase from "../../../core/domains/usecases/CarrierUseCase"
import CarrierDTO from "../../../core/dtos/CarrierDTO"
import ICarrierDTO from "../../../core/dtos/interfaces/ICarrierDTO"
import ICarrierRepository from "../../../core/repositories/interfaces/ICarrierRepository"

class MockCarrierRepository implements ICarrierRepository {
  private carriers: (ICarrier | ICarrierDTO)[]
  private isError: boolean

  constructor(carriers: (ICarrier | ICarrierDTO)[], isError = false) {
    this.carriers = carriers
    this.isError = isError
  }

  async getCarriers(): Promise<{
    isError: boolean
    message: string
    data: (ICarrier | ICarrierDTO)[]
  }> {
    return {
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.carriers
    }
  }
}

class TestCarrierUseCase extends CarrierUseCase {
  private server: boolean

  constructor(carrierRepository: ICarrierRepository, server: boolean) {
    super(carrierRepository)
    this.server = server
  }

  protected isServer(): boolean {
    return this.server
  }
}

describe("CarrierUseCase", () => {
  test("should return carriers as CarrierDTO when isServer is true", async () => {
    const mockCarriers: ICarrier[] = [
      {
        id: "",
        no: 1,
        name: "Carrier1",
        displayName: "Carrier-1",
        isCrawlable: true,
        isPopupEnabled: false,
        popupURL: ""
      }
    ]
    const mockCarrierRepository = new MockCarrierRepository(mockCarriers)
    const carrierUseCase = new TestCarrierUseCase(mockCarrierRepository, true)

    const result = await carrierUseCase.getCarriers()

    expect(result.isError).toBe(false)
    expect(result.data).toEqual(
      mockCarriers.map(
        (carrier) =>
          new CarrierDTO({
            id: carrier.id,
            no: carrier.no,
            name: carrier.name,
            displayName: carrier.displayName,
            isCrawlable: carrier.isCrawlable,
            isPopupEnabled: carrier.isPopupEnabled,
            popupURL: carrier.popupURL
          })
      )
    )
  })

  test("should return carriers as Carrier when isServer is false", async () => {
    const mockCarriers: ICarrierDTO[] = [
      {
        id: "1",
        no: 1,
        name: "Carrier1",
        displayName: "Carrier-1",
        isCrawlable: true,
        isPopupEnabled: false,
        popupURL: ""
      }
    ]
    const mockCarrierRepository = new MockCarrierRepository(mockCarriers)
    const carrierUseCase = new TestCarrierUseCase(mockCarrierRepository, false)

    const result = await carrierUseCase.getCarriers()

    expect(result.isError).toBe(false)
    expect(result.data).toEqual(
      mockCarriers.map(
        (carrier) =>
          new Carrier({
            id: carrier.id,
            no: carrier.no,
            name: carrier.name,
            displayName: carrier.displayName,
            isCrawlable: carrier.isCrawlable,
            isPopupEnabled: carrier.isPopupEnabled,
            popupURL: carrier.popupURL
          })
      )
    )
  })

  test("should return error message when repository returns an error", async () => {
    const mockCarrierRepository = new MockCarrierRepository([], true)
    const carrierUseCase = new TestCarrierUseCase(mockCarrierRepository, true)

    const result = await carrierUseCase.getCarriers()

    expect(result.isError).toBe(true)
    expect(result.message).toBe("Error")
    expect(result.data).toBeUndefined()
  })
})
