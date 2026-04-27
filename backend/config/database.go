package config

import (
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	dsn := "root:1712@tcp(127.0.0.1:3306)/kursku_db?charset=utf8mb4&parseTime=True&loc=Local"

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Gagal menyambung ke database! Periksa apakah MySQL sudah jalan.")
	}

	err = database.AutoMigrate(
		&Models.User{},
		&Models.Course{},
		&Models.Enrollment{},
		&Models.Module{},
		&Models.Grade{},
	)

	if err != nil {
		fmt.Println("Gagal migrasi", err)
	}
	fmt.Println("Koneksi & Migrate berhasil")
	DB = database
}
