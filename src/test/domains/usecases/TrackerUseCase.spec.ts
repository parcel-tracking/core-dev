import DeliveryDTO from "../../../core/dtos/DeliveryDTO"
import IDeliveryDTO from "../../../core/dtos/interfaces/IDeliveryDTO"
import ITrackerDTO from "../../../core/dtos/interfaces/ITrackerDTO"
import ITrackerRepository from "../../../core/repositories/interfaces/ITrackerRepository"
import DeliveryLocationVO from "../../../core/vos/DeliveryLocationVO"
import DeliveryStateVO from "../../../core/vos/DeliveryStateVO"
import ITracker from "../../../core/domains/entities/interfaces/ITracker"
import TrackerUseCase from "../../../core/domains/usecases/TrackerUseCase"
import Tracker from "../../../core/domains/entities/Tracker"
import TrackerDTO from "../../../core/dtos/TrackerDTO"
import LayerDTO from "../../../core/dtos/LayerDTO"
import ICarrierRepository from "../../../core/repositories/interfaces/ICarrierRepository"
import Carrier from "../../../core/domains/entities/Carrier"

describe("TrackerUseCase", () => {
  let trackerRepository: jest.Mocked<ITrackerRepository>
  let carrierRepository: jest.Mocked<ICarrierRepository>
  let trackerUseCase: TrackerUseCase
  let tracker: jest.Mocked<ITracker>

  beforeEach(() => {
    trackerRepository = {
      getDelivery: jest.fn(),
      getTrackers: jest.fn(),
      addTracker: jest.fn(),
      updateTracker: jest.fn(),
      deleteTracker: jest.fn()
    } as jest.Mocked<ITrackerRepository>

    carrierRepository = {
      getCarriers: jest.fn(),
      getCarrier: jest.fn()
    } as jest.Mocked<ICarrierRepository>

    tracker = {
      updateCarrierId: jest.fn(),
      updateLabel: jest.fn(),
      updateTrackingNumber: jest.fn(),
      addMemo: jest.fn(),
      updateMemo: jest.fn(),
      deleteMemo: jest.fn()
    } as unknown as jest.Mocked<ITracker>

    trackerUseCase = new TrackerUseCase(trackerRepository, carrierRepository)
  })

  it("should get delivery details", async () => {
    const carrierId = "carrier-id"
    const trackingNumber = "tracking-number"
    const delivery: IDeliveryDTO = new DeliveryDTO({
      from: new DeliveryLocationVO({
        name: "Warehouse",
        time: "8:00 AM",
        address: "123 Warehouse St"
      }),
      to: new DeliveryLocationVO({
        name: "Customer",
        time: "5:00 PM",
        address: "456 Customer Rd"
      }),
      progresses: [],
      state: new DeliveryStateVO({
        id: "1",
        name: "In Transit"
      })
    })

    const deliveryDTO = new LayerDTO({ data: delivery })
    const carrier = new Carrier({
      id: "carrier-id",
      no: 1,
      name: "carrier-name",
      displayName: "carrrier-display-name",
      isCrawlable: true,
      isPopupEnabled: true,
      popupURL: "http://"
    })
    const carrierDTO = new LayerDTO({
      data: carrier
    })
    carrierRepository.getCarrier.mockResolvedValue(carrierDTO)
    trackerRepository.getDelivery.mockResolvedValue(deliveryDTO)

    const result = await trackerUseCase.getDelivery(carrierId, trackingNumber)

    expect(result).toBe(deliveryDTO)
    expect(trackerRepository.getDelivery).toHaveBeenCalledWith(
      carrier,
      trackingNumber
    )
  })

  it("should add a tracker", async () => {
    const newTracker = new Tracker({
      id: "tracker-id"
    })
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.addTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.addTracker(newTracker)
    expect(result).toBe(isSuccessDTO)
    expect(trackerRepository.addTracker).toHaveBeenCalled()
  })

  it("should get trackers", async () => {
    const trackers: ITracker[] = [
      new Tracker({
        id: "tracker-id",
        carrierId: "carrier-id",
        label: "label",
        trackingNumber: "tracking-number",
        memos: []
      })
    ]
    const repoLayerDTO = new LayerDTO({ data: trackers })

    const trackerDTOs: ITrackerDTO[] = trackers.map((entitiy) => {
      return new TrackerDTO({
        id: entitiy.id,
        carrierId: entitiy.carrierId,
        label: entitiy.label,
        trackingNumber: entitiy.trackingNumber,
        memos: entitiy.memos
      })
    })
    const usecaseLayerDTO = new LayerDTO({ data: trackerDTOs })

    trackerRepository.getTrackers.mockResolvedValue(repoLayerDTO)
    const result = await trackerUseCase.getTrackers()
    expect(result).toStrictEqual(usecaseLayerDTO)
    expect(trackerRepository.getTrackers).toHaveBeenCalled()
  })

  it("should update carrierId", async () => {
    const newCarrierId = "new carrier id"
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.updateTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.updateCarrierId(tracker, newCarrierId)
    expect(result).toBe(isSuccessDTO)
    expect(tracker.updateCarrierId).toHaveBeenCalledWith(newCarrierId)
    expect(trackerRepository.updateTracker).toHaveBeenCalledWith(tracker)
  })

  it("should update label", async () => {
    const newLabel = "new label"
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.updateTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.updateLabel(tracker, newLabel)
    expect(result).toBe(isSuccessDTO)
    expect(tracker.updateLabel).toHaveBeenCalledWith(newLabel)
    expect(trackerRepository.updateTracker).toHaveBeenCalledWith(tracker)
  })

  it("should update tracking number", async () => {
    const newTrackingNumber = "123456789"
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.updateTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.updateTrackingNumber(
      tracker,
      newTrackingNumber
    )
    expect(result).toBe(isSuccessDTO)
    expect(tracker.updateTrackingNumber).toHaveBeenCalledWith(newTrackingNumber)
    expect(trackerRepository.updateTracker).toHaveBeenCalledWith(tracker)
  })

  it("should add a memo", async () => {
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.updateTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.addMemo(tracker)
    expect(result).toBe(isSuccessDTO)
    expect(tracker.addMemo).toHaveBeenCalled()
    expect(trackerRepository.updateTracker).toHaveBeenCalledWith(tracker)
  })

  it("should update a memo", async () => {
    const index = 0
    const newMemo = "new memo"
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.updateTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.updateMemo(tracker, index, newMemo)
    expect(result).toBe(isSuccessDTO)
    expect(tracker.updateMemo).toHaveBeenCalledWith(index, newMemo)
    expect(trackerRepository.updateTracker).toHaveBeenCalledWith(tracker)
  })

  it("should delete a memo", async () => {
    const index = 0
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.updateTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.deleteMemo(tracker, index)
    expect(result).toBe(isSuccessDTO)
    expect(tracker.deleteMemo).toHaveBeenCalledWith(index)
    expect(trackerRepository.updateTracker).toHaveBeenCalledWith(tracker)
  })

  it("should delete a tracker", async () => {
    const trackerId = "tracker-id"
    const isSuccessDTO = new LayerDTO({ data: true })
    trackerRepository.deleteTracker.mockResolvedValue(isSuccessDTO)
    const result = await trackerUseCase.deleteTracker(trackerId)
    expect(result).toBe(isSuccessDTO)
    expect(trackerRepository.deleteTracker).toHaveBeenCalledWith(trackerId)
  })
})
