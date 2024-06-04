import ICarrier from "../../domains/entities/interfaces/ICarrier"
import ITracker from "../../domains/entities/interfaces/ITracker"
import IDeliveryDTO from "../../dtos/interfaces/IDeliveryDTO"
import ILayerDTO from "../../dtos/interfaces/ILayerDTO"
import ITrackerDTO from "../../dtos/interfaces/ITrackerDTO"

export default interface ITrackerRepository {
  getDelivery?(
    carrier: ICarrier,
    trackingNumber: string
  ): Promise<ILayerDTO<IDeliveryDTO>>
  getTrackers?(): Promise<ILayerDTO<ITracker[] | ITrackerDTO[]>>
  addTracker?(tracker: ITracker): Promise<ILayerDTO<boolean>>
  updateTracker?(tracker: ITracker): Promise<ILayerDTO<boolean>>
  deleteTracker?(trackerId: string): Promise<ILayerDTO<boolean>>
  clearTrackers?(): Promise<ILayerDTO<boolean>>
}
