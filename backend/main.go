package main

import (
	"backend/config"
	"backend/routes"
	"log"
	"os"

	"github.com/gofiber/fiber/v3"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading file .env")
	}

	config.ConnectDatabase()

	config.SeedAdmin()

	app := fiber.New(fiber.Config{
		AppName: "LMS api v1.0",
	})

	routes.SetUp(app)

	app.Use(func(c fiber.Ctx) error {
		return c.Status(404).JSON(fiber.Map{
			"message": "endpoint tidak ditemukan",
		})
	})

	port := os.Getenv("DB_PORT_APP")
	if port == "" {
		port = "8080"
	}

	log.Printf("server berjalan di port %s", port)
	log.Fatal(app.Listen(":" + port))
}
