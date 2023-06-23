package model

type SeatType string

const (
	CHILD    SeatType = "CHILD"
	STUDENT  SeatType = "STUDENT"
	ADULT    SeatType = "ADULT"
	DISABLED SeatType = "DISABLED"
)

type Seat struct {
	SeatId uint64   `json:"seatId" gorm:"primary_key"`
	ResId  uint64   `json:"resId" gorm:"not null"`
	Number uint16   `json:"number"`
	Type   SeatType `json:"type"`
}
