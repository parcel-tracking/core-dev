import LayerDTO from "../../dtos/LayerDTO"
import TrackerDTO from "../../dtos/TrackerDTO"
import IDeliveryDTO from "../../dtos/interfaces/IDeliveryDTO"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"
import ITrackerDTO from "../../dtos/interfaces/ITrackerDTO"
import ICarrierRepository from "../../repositories/interfaces/ICarrierRepository"
import ITrackerRepository from "../../repositories/interfaces/ITrackerRepository"
import ITracker from "../entities/interfaces/ITracker"
import ITrackerUseCase from "./interfaces/ITrackerUseCase"

export default class TrackerUseCase implements ITrackerUseCase {
  private trackerRepository: ITrackerRepository
  private carrierRepository: ICarrierRepository

  constructor(
    trackerRepository: ITrackerRepository,
    carrierRepository: ICarrierRepository
  ) {
    this.trackerRepository = trackerRepository
    this.carrierRepository = carrierRepository
  }

  async getDelivery(
    carrierId: string,
    trackingNumber: string
  ): Promise<ILayerDTO<IDeliveryDTO>> {
    if (typeof this.trackerRepository.getDelivery === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }
    const {
      isError,
      message,
      data: carrier
    } = await this.carrierRepository.getCarrier(carrierId)
    if (isError) {
      return new LayerDTO({ isError, message })
    }
    return this.trackerRepository.getDelivery(carrier, trackingNumber)
  }

  async addTracker(newTracker: ITracker): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.addTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    return this.trackerRepository.addTracker(newTracker)
  }

  async getTrackers(): Promise<ILayerDTO<ITrackerDTO[]>> {
    if (typeof this.trackerRepository.getTrackers === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    const {
      isError,
      message,
      data: trackers
    } = await this.trackerRepository.getTrackers()

    if (isError) {
      return new LayerDTO({
        isError,
        message
      })
    }

    const trackerDTOs = trackers.map((entity) => {
      return new TrackerDTO({
        id: entity.id,
        carrierId: entity.carrierId,
        label: entity.label,
        trackingNumber: entity.trackingNumber,
        memos: entity.memos
      })
    })

    return new LayerDTO({
      data: trackerDTOs
    })
  }

  async updateCarrierId(
    tracker: ITracker,
    newCarrierId: string
  ): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.updateTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    tracker.updateCarrierId(newCarrierId)

    return this.trackerRepository.updateTracker(tracker)
  }

  async updateLabel(
    tracker: ITracker,
    newLabel: string
  ): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.updateTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    tracker.updateLabel(newLabel)

    return this.trackerRepository.updateTracker(tracker)
  }

  async updateTrackingNumber(
    tracker: ITracker,
    newTrackingNumber: string
  ): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.updateTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    tracker.updateTrackingNumber(newTrackingNumber)

    return this.trackerRepository.updateTracker(tracker)
  }

  async addMemo(tracker: ITracker): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.updateTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    tracker.addMemo()

    return this.trackerRepository.updateTracker(tracker)
  }

  async updateMemo(
    tracker: ITracker,
    index: number,
    newMemo: string
  ): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.updateTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    tracker.updateMemo(index, newMemo)

    return this.trackerRepository.updateTracker(tracker)
  }

  async deleteMemo(
    tracker: ITracker,
    index: number
  ): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.updateTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    tracker.deleteMemo(index)

    return this.trackerRepository.updateTracker(tracker)
  }

  async deleteTracker(trackerId: string): Promise<ILayerDTO<boolean>> {
    if (typeof this.trackerRepository.deleteTracker === "undefined") {
      return new LayerDTO({
        isError: true,
        message: "the wrong approach.."
      })
    }

    return this.trackerRepository.deleteTracker(trackerId)
  }
}
