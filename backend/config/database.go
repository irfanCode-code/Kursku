package config

import (
	"fmt"

	"backend/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := "root:1712@tcp(127.0.0.1:3306)/kursku_db?charset=utf8mb4&parseTime=True&loc=Local"

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Gagal menyambung ke database")
	}

	database.AutoMigrate(
		&models.User{},
		&models.Enrollment{},
		&models.Course{},
		&models.Module{},
		&models.Grade{},
	)

	if err != nil {
		fmt.Println("Gagal migrasi", err)
	}
	fmt.Println("Koneksi berhasil")
	DB = database
}
