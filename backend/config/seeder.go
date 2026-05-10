package config

import (
	"backend/models"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func SeedAdmin() {
	var count int64

	DB.Model(&models.User{}).Where("role = ?", "admin").Count(&count)

	if count == 0 {
		hashPass, _ := bcrypt.GenerateFromPassword([]byte("AdminApp"), bcrypt.DefaultCost)

		admin := models.User{
			Nama:     "imAdmin",
			Email:    "imAdmin@lms.com",
			Password: string(hashPass),
			Role:     "admin",
		}

		if err := DB.Create(&admin).Error; err != nil {
			log.Println("gagal membuat seed admin: ", err)
		} else {
			log.Println("seeder admin berhasil dibuat")
			log.Println("email: imAdmin@lms.com | password: AdminApp")
		}
	}
}
