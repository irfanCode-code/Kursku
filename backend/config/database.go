package config

import (
	"fmt"
	"log"
	"os"

	"backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	err := godotenv.Load()
	if err != nil {
		log.Println("gagal memuat .env")
	}

	user := os.Getenv("DB_USER")
	pass := os.Getenv("DB_PASS")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	if user == "" || pass == "" || host == "" || port == "" || name == "" {
		panic("konfigurasi database tidak lengkap cek .env")
	}
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, pass, host, port, name)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})

	if err != nil {
		panic("Gagal menyambung ke database")
	}

	fmt.Println("berhasil tersambung ke database")

	if err := database.AutoMigrate(
		&models.User{},
		&models.Kursus{},
		&models.Modul{},
		&models.Nilai{},
		&models.Progres{},
		&models.Soal{},
		&models.KelasMember{},
		&models.Post{},
		&models.Comment{},
		&models.LikeComment{},
		&models.ShopItem{},
	); err != nil {
		log.Fatal("gagal migrasi: " + err.Error())
	}

	fmt.Println("Koneksi berhasil")

	DB = database
}
