import ITrackerDTO from "./interfaces/ITrackerDTO"

export default class TrackerDTO implements ITrackerDTO {
  readonly id: string
  readonly carrierId: string
  readonly label: string
  readonly trackingNumber: string
  readonly memos: string[]

  constructor({
    id,
    carrierId,
    label,
    trackingNumber,
    memos
  }: {
    id: string
    carrierId: string
    label: string
    trackingNumber: string
    memos: string[]
  }) {
    this.id = id
    this.carrierId = carrierId
    this.label = label
    this.trackingNumber = trackingNumber
    this.memos = memos
  }
}
