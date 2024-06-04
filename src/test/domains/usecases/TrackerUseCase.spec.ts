import Carrier from "../../../core/domains/entities/Carrier"
import Tracker from "../../../core/domains/entities/Tracker"
import ICarrier from "../../../core/domains/entities/interfaces/ICarrier"
import ITracker from "../../../core/domains/entities/interfaces/ITracker"
import TrackerUseCase from "../../../core/domains/usecases/TrackerUseCase"
import DeliveryDTO from "../../../core/dtos/DeliveryDTO"
import LayerDTO from "../../../core/dtos/LayerDTO"
import TrackerDTO from "../../../core/dtos/TrackerDTO"
import ICarrierDTO from "../../../core/dtos/interfaces/ICarrierDTO"
import IDeliveryDTO from "../../../core/dtos/interfaces/IDeliveryDTO"
import ILayerDTO from "../../../core/dtos/interfaces/ILayerDTO"
import ITrackerDTO from "../../../core/dtos/interfaces/ITrackerDTO"
import ICarrierRepository from "../../../core/repositories/interfaces/ICarrierRepository"
import ITrackerRepository from "../../../core/repositories/interfaces/ITrackerRepository"
import DeliveryLocationVO from "../../../core/vos/DeliveryLocationVO"
import DeliveryStateVO from "../../../core/vos/DeliveryStateVO"

class MockCarrierRepository implements ICarrierRepository {
  private carrier: ICarrier | ICarrierDTO
  private isError: boolean

  constructor(carrier: ICarrier | ICarrierDTO, isError = false) {
    this.carrier = carrier
    this.isError = isError
  }

  async getCarrier(carrierId: string): Promise<{
    isError: boolean
    message: string
    data: ICarrier | ICarrierDTO
  }> {
    return {
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.carrier
    }
  }
}

class MockTrackerRepository implements ITrackerRepository {
  private trackers: (ITracker | ITrackerDTO)[]
  private isError: boolean
  private delivery: IDeliveryDTO
  private result: boolean

  constructor(
    trackers: (ITracker | ITrackerDTO)[],
    delivery: IDeliveryDTO,
    result: boolean,
    isError = false
  ) {
    this.trackers = trackers
    this.delivery = delivery
    this.result = result
    this.isError = isError
  }

  async getTrackers(): Promise<{
    isError: boolean
    message: string
    data: (ITracker | ITrackerDTO)[]
  }> {
    return {
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.trackers
    }
  }

  async getDelivery(
    carrier: ICarrier | ICarrierDTO,
    trackingNumber: string
  ): Promise<ILayerDTO<IDeliveryDTO>> {
    return new LayerDTO({
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.delivery
    })
  }

  async addTracker(newTracker: ITracker): Promise<ILayerDTO<boolean>> {
    return new LayerDTO({
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.result
    })
  }

  async updateTracker(tracker: ITracker): Promise<ILayerDTO<boolean>> {
    return new LayerDTO({
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.result
    })
  }

  async deleteTracker(trackerId: string): Promise<ILayerDTO<boolean>> {
    return new LayerDTO({
      isError: this.isError,
      message: this.isError ? "Error" : "Success",
      data: this.result
    })
  }
}

class TestTrackerUseCase extends TrackerUseCase {
  private server: boolean

  constructor(
    trackerRepository: ITrackerRepository,
    carrierRepository: ICarrierRepository,
    server: boolean
  ) {
    super(trackerRepository, carrierRepository)
    this.server = server
  }

  protected isServer(): boolean {
    return this.server
  }
}

describe("TrackerUseCase", () => {
  test("should return delivery details", async () => {
    const mockCarrier = new Carrier({
      id: "1",
      no: 1,
      name: "Carrier1",
      displayName: "Carrier-1",
      isCrawlable: true,
      isPopupEnabled: false,
      popupURL: ""
    })
    const mockDelivery: IDeliveryDTO = new DeliveryDTO({
      from: new DeliveryLocationVO(),
      to: new DeliveryLocationVO(),
      progresses: [],
      state: new DeliveryStateVO()
    })
    const mockCarrierRepository = new MockCarrierRepository(mockCarrier)
    const mockTrackerRepository = new MockTrackerRepository(
      [],
      mockDelivery,
      true
    )
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )

    const result = await trackerUseCase.getDelivery("1", "123456")

    expect(result.isError).toBe(false)
    expect(result.data).toEqual(mockDelivery)
  })

  test("should return error when carrier repository returns an error", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null, true)
    const mockTrackerRepository = new MockTrackerRepository([], null, false)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )

    const result = await trackerUseCase.getDelivery("1", "123456")

    expect(result.isError).toBe(true)
    expect(result.message).toBe("Error")
  })

  test("should add a new tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const newTracker = new Tracker({
      id: "1"
    })

    const result = await trackerUseCase.addTracker(newTracker)

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should return trackers as TrackerDTO when isServer is true", async () => {
    const mockTrackers: ITracker[] = [
      new Tracker({
        id: "1",
        carrierId: "1",
        label: "Label",
        trackingNumber: "123456",
        memos: []
      })
    ]
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository(
      mockTrackers,
      null,
      true
    )
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )

    const result = await trackerUseCase.getTrackers()

    expect(result.isError).toBe(false)
    expect(result.data).toEqual(
      mockTrackers.map(
        (tracker) =>
          new TrackerDTO({
            id: tracker.id,
            carrierId: tracker.carrierId,
            label: tracker.label,
            trackingNumber: tracker.trackingNumber,
            memos: tracker.memos
          })
      )
    )
  })

  test("should return trackers as Tracker when isServer is false", async () => {
    const mockTrackers: ITrackerDTO[] = [
      {
        id: "1",
        carrierId: "1",
        label: "Label",
        trackingNumber: "123456",
        memos: []
      }
    ]
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository(
      mockTrackers,
      null,
      true
    )
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      false
    )

    const result = await trackerUseCase.getTrackers()

    expect(result.isError).toBe(false)
    expect(result.data).toEqual(
      mockTrackers.map(
        (tracker) =>
          new Tracker({
            id: tracker.id,
            carrierId: tracker.carrierId,
            label: tracker.label,
            trackingNumber: tracker.trackingNumber,
            memos: tracker.memos
          })
      )
    )
  })

  test("should return error when tracker repository returns an error in getTrackers", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository(
      [],
      null,
      false,
      true
    )
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )

    const result = await trackerUseCase.getTrackers()

    expect(result.isError).toBe(true)
    expect(result.message).toBe("Error")
  })

  test("should update carrier ID of tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const tracker = new Tracker({
      id: "1",
      carrierId: "1",
      label: "Label",
      trackingNumber: "123456",
      memos: []
    })

    const result = await trackerUseCase.updateCarrierId(tracker, "2")

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should update label of tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const tracker = new Tracker({
      id: "1",
      carrierId: "1",
      label: "Label",
      trackingNumber: "123456",
      memos: []
    })

    const result = await trackerUseCase.updateLabel(tracker, "New Label")

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should update tracking number of tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const tracker = new Tracker({
      id: "1",
      carrierId: "1",
      label: "Label",
      trackingNumber: "123456",
      memos: []
    })

    const result = await trackerUseCase.updateTrackingNumber(tracker, "654321")

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should add memo to tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const tracker = new Tracker({
      id: "1",
      carrierId: "1",
      label: "Label",
      trackingNumber: "123456",
      memos: []
    })

    const result = await trackerUseCase.addMemo(tracker)

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should update memo of tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const tracker = new Tracker({
      id: "1",
      carrierId: "1",
      label: "Label",
      trackingNumber: "123456",
      memos: []
    })

    const result = await trackerUseCase.updateMemo(tracker, 0, "Updated Memo")

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should delete memo of tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )
    const tracker = new Tracker({
      id: "1",
      carrierId: "1",
      label: "Label",
      trackingNumber: "123456",
      memos: []
    })

    const result = await trackerUseCase.deleteMemo(tracker, 0)

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })

  test("should delete tracker", async () => {
    const mockCarrierRepository = new MockCarrierRepository(null)
    const mockTrackerRepository = new MockTrackerRepository([], null, true)
    const trackerUseCase = new TestTrackerUseCase(
      mockTrackerRepository,
      mockCarrierRepository,
      true
    )

    const result = await trackerUseCase.deleteTracker("1")

    expect(result.isError).toBe(false)
    expect(result.data).toBe(true)
  })
})
