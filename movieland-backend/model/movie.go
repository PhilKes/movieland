package model

import (
	"time"
)

type Movie struct {
	MovId       uint64    `json:"movId" gorm:"primary_key"`
	Name        string    `json:"name" gorm:"not null"`
	Date        time.Time `json:"date"`
	Description string    `json:"description"`
	PosterUrl   string    `json:"posterUrl"`
	Length      uint64    `json:"length"`
	TmdbId      uint64    `json:"tmdbId"`
	// Shows       []MovieShow `json:"-" gorm:"foreignKey:ShowId;references:MovId"`
}
