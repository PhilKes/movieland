package model

type RoleName string

const (
	ROLE_USER    RoleName = "ROLE_USER"
	ROLE_ADMIN   RoleName = "ROLE_ADMIN"
	ROLE_CASHIER RoleName = "ROLE_CASHIER"
)

type Role struct {
	Id   uint64   `json:"id" gorm:"primary_key"`
	Name RoleName `json:"name" gorm:"not null"`
}
