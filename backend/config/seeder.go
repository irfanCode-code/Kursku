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

func SeedShopItem() {
	var count int64
	DB.Model(&models.ShopItem{}).Count(&count)

	if count == 0 {
		items := []models.ShopItem{
			{
				NamaItem:  "Border Perunggu",
				Deskripsi: "profil sederhana",
				HargaPoin: 100,
				Tipe:      "avatar_frame",
			},
			{
				NamaItem:  "Border Perak",
				Deskripsi: "profil nuansa perak",
				HargaPoin: 150,
				Tipe:      "avatar_frame",
			},
			{
				NamaItem:  "Border Emas",
				Deskripsi: "Profil premium",
				HargaPoin: 200,
				Tipe:      "avatar_frame",
			},
		}
		for _, item := range items {
			if err := DB.Create(&item).Error; err != nil {
				log.Println("gagal membuat seed item shop: ", err)
			}
		}
		log.Println("seeder 3 item border berhasil ditambahkan")
	}
}
