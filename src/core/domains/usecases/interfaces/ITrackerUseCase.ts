import IDeliveryDTO from "../../../dtos/interfaces/IDeliveryDTO"
import ILayerDTO from "../../../dtos/interfaces/ILayerDTO"
import ITrackerDTO from "../../../dtos/interfaces/ITrackerDTO"
import ITracker from "../../entities/interfaces/ITracker"

export default interface ITrackerUseCase {
  getDelivery(
    carrierId: string,
    trackingNumber: string
  ): Promise<ILayerDTO<IDeliveryDTO>>
  addTracker(newTracker: ITracker): Promise<ILayerDTO<boolean>>
  getTrackers(): Promise<ILayerDTO<ITrackerDTO[]>>
  updateCarrierId(
    tracker: ITracker,
    newCarrierId: string
  ): Promise<ILayerDTO<boolean>>
  updateLabel(tracker: ITracker, newLabel: string): Promise<ILayerDTO<boolean>>
  updateTrackingNumber(
    tracker: ITracker,
    newTrackingNumber: string
  ): Promise<ILayerDTO<boolean>>
  addMemo(tracker: ITracker): Promise<ILayerDTO<boolean>>
  updateMemo(
    tracker: ITracker,
    index: number,
    newMemo: string
  ): Promise<ILayerDTO<boolean>>
  deleteMemo(tracker: ITracker, index: number): Promise<ILayerDTO<boolean>>
  deleteTracker(trackerId: string): Promise<ILayerDTO<boolean>>
}
