import LayerDTO from "../../dtos/LayerDTO"
import TrackerDTO from "../../dtos/TrackerDTO"
import IDeliveryDTO from "../../dtos/interfaces/IDeliveryDTO"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"
import ITrackerDTO from "../../dtos/interfaces/ITrackerDTO"
import ICarrierRepository from "../../repositories/interfaces/ICarrierRepository"
import ITrackerRepository from "../../repositories/interfaces/ITrackerRepository"
import Tracker from "../entities/Tracker"
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
    return this.trackerRepository.addTracker(newTracker)
  }

  async getTrackers(): Promise<ILayerDTO<ITracker[] | ITrackerDTO[]>> {
    const { isError, message, data } =
      await this.trackerRepository.getTrackers()

    if (isError) {
      return new LayerDTO({
        isError,
        message
      })
    }

    const trackers = data.map((tracker: ITracker | ITrackerDTO) => {
      if (this.isServer()) {
        return new TrackerDTO({
          id: tracker.id,
          carrierId: tracker.carrierId,
          label: tracker.label,
          trackingNumber: tracker.trackingNumber,
          memos: tracker.memos
        })
      } else {
        return new Tracker({
          id: tracker.id,
          carrierId: tracker.carrierId,
          label: tracker.label,
          trackingNumber: tracker.trackingNumber,
          memos: tracker.memos
        })
      }
    })

    return new LayerDTO({
      data: trackers
    })
  }

  async deleteTracker(trackerId: string): Promise<ILayerDTO<boolean>> {
    return this.trackerRepository.deleteTracker(trackerId)
  }

  async clearTrackers(): Promise<ILayerDTO<boolean>> {
    return this.trackerRepository.clearTrackers()
  }

  async updateCarrierId(
    tracker: ITracker,
    newCarrierId: string
  ): Promise<ILayerDTO<boolean>> {
    tracker.updateCarrierId(newCarrierId)

    return this.trackerRepository.updateTracker(tracker)
  }

  async updateLabel(
    tracker: ITracker,
    newLabel: string
  ): Promise<ILayerDTO<boolean>> {
    tracker.updateLabel(newLabel)

    return this.trackerRepository.updateTracker(tracker)
  }

  async updateTrackingNumber(
    tracker: ITracker,
    newTrackingNumber: string
  ): Promise<ILayerDTO<boolean>> {
    tracker.updateTrackingNumber(newTrackingNumber)

    return this.trackerRepository.updateTracker(tracker)
  }

  async addMemo(tracker: ITracker): Promise<ILayerDTO<boolean>> {
    tracker.addMemo()

    return this.trackerRepository.updateTracker(tracker)
  }

  async updateMemo(
    tracker: ITracker,
    index: number,
    newMemo: string
  ): Promise<ILayerDTO<boolean>> {
    tracker.updateMemo(index, newMemo)

    return this.trackerRepository.updateTracker(tracker)
  }

  async deleteMemo(
    tracker: ITracker,
    index: number
  ): Promise<ILayerDTO<boolean>> {
    tracker.deleteMemo(index)

    return this.trackerRepository.updateTracker(tracker)
  }

  protected isServer(): boolean {
    return typeof window === "undefined"
  }
}
