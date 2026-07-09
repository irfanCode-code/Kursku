package main

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v3"
	"github.com/irfanCode-code/kursku/backend/config"
)

func main() {
	fmt.Println("memulai server...")
	config.ConnectDatabase()
	fmt.Println("berhasil terkoneksi ke database")
	app := fiber.New()

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Hello, World!")
	})

	log.Fatal(app.Listen(":8080"))
}
