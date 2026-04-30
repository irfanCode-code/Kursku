package main

import (
	"backend/config"

	"github.com/gofiber/fiber/v3"
)

func main() {
	config.ConnectDatabase()

	app := fiber.New()

	app.Get("/", func(c fiber.Ctx) error {
		return c.SendString("Database kursku sudah sinkron")
	})

	app.Listen(":8080")
}
