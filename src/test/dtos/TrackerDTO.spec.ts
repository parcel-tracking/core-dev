import TrackerDTO from "../../core/dtos/TrackerDTO"
import ITrackerDTO from "../../core/dtos/interfaces/ITrackerDTO"

describe("TrackerDTO", () => {
  let trackerDTO: ITrackerDTO

  beforeEach(() => {
    trackerDTO = Object.freeze(
      new TrackerDTO({
        id: "test-id",
        carrierId: "carrier-id",
        label: "test-label",
        trackingNumber: "123456",
        memos: ["memo1", "memo2"]
      })
    )
  })

  it("should create a TrackerDTO instance", () => {
    expect(trackerDTO).toBeInstanceOf(TrackerDTO)
  })

  it("should have a readonly id property", () => {
    expect(trackerDTO.id).toBe("test-id")
    expect(() => {
      ;(trackerDTO as any).id = "new-id"
    }).toThrow()
  })

  it("should have a readonly carrier property", () => {
    expect(trackerDTO.carrierId).toBe("carrier-id")
    expect(() => {
      ;(trackerDTO as any).carrierId = "new-carrier-id"
    }).toThrow()
  })

  it("should have a readonly label property", () => {
    expect(trackerDTO.label).toBe("test-label")
    expect(() => {
      ;(trackerDTO as any).label = "new-label"
    }).toThrow()
  })

  it("should have a readonly trackingNumber property", () => {
    expect(trackerDTO.trackingNumber).toBe("123456")
    expect(() => {
      ;(trackerDTO as any).trackingNumber = "654321"
    }).toThrow()
  })

  it("should have a readonly memos property", () => {
    expect(trackerDTO.memos).toEqual(["memo1", "memo2"])
    expect(() => {
      ;(trackerDTO as any).memos = ["new-memo"]
    }).toThrow()
  })
})
