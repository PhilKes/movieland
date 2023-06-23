package model

type PaymentMethod string

const (
	CASH      PaymentMethod = "CASH"
	DEBITCARD PaymentMethod = "DEBITCARD"
	PAYPAL    PaymentMethod = "PAYPAL"
)

type Reservation struct {
	ResId     uint64        `json:"resId" gorm:"primary_key"`
	ShowRefer uint64        `json:"showId"`
	Show      MovieShow     `json:"show" gorm:"foreignKey:ShowRefer;references:ShowId"`
	UserId    uint64        `json:"userId" gorm:"not null"`
	User      User          `json:"user" gorm:"foreignKey:UserId;references:Id"`
	Validated bool          `json:"validated"`
	TotalSum  float32       `json:"totalSum"`
	Method    PaymentMethod `json:"paymentMethod"`
	CashierId uint64        `json:"cashierId"`
}
