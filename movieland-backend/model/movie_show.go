package model

import "time"

type MovieShow struct {
	ShowId  uint64    `json:"showId" gorm:"primary_key"`
	MovieId uint64    `json:"movId"`
	Movie   Movie     `json:"-" gorm:"foreignKey:MovieId;references:MovId"`
	Date    time.Time `json:"date"`
}
