package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/irfanCode-code/kursku/backend/config"
	"github.com/irfanCode-code/kursku/backend/models"
	"github.com/irfanCode-code/kursku/backend/routes"
)

func main() {
	fmt.Println("memulai server...")
	config.ConnectDatabase()

	fmt.Println("menjalankan migrasi database...")
	err := config.DB.AutoMigrate(
		&models.User{},
		&models.Kursus{},
		&models.Modul{},
		&models.Progress{},
		&models.Submission{},
	)
	if err != nil {
		log.Fatal("gagal melakukan migrasi database", err)
	}

	fmt.Println("berhasil melakukan migrasi database")
	fmt.Println("berhasil terkoneksi ke database")
	app := fiber.New()

	routes.SetUp(app)

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	log.Fatal(app.Listen(":8080"))
}
