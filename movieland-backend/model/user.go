package model

type User struct {
	Id       uint64 `json:"id" gorm:"primary_key"`
	Name     string `json:"name" binding:"max=40"`
	Username string `json:"username" binding:"max=15"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"-",  binding:"max=100"`
	Roles    []Role `gorm:"many2many:user_roles"`
}
