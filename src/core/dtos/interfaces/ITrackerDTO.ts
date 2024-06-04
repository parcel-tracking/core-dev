export default interface ITrackerDTO {
  readonly id: string
  readonly carrierId: string
  readonly label: string
  readonly trackingNumber: string
  readonly memos: string[]
}
