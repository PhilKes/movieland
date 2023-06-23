package model

import (
	"fmt"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	fmt.Println("Connecting to DB")

	dsn := "host=localhost user=movielandadmin password=movielandadmin dbname=movieland_db port=5432 sslmode=disable"
	database, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to database!")
	}

	err = database.AutoMigrate(&Role{}, &User{}, &Movie{}, &MovieShow{}, &Seat{}, &Reservation{})
	if err != nil {
		fmt.Println("Error occurred during DB migration")
		return
	}
	fmt.Println("Migrated DB successfully")
	DB = database
}
