package routes

import (
	"backend/controllers"
	"backend/middleware"

	"github.com/gofiber/fiber/v3"
)

func SetUp(app *fiber.App) {
	app.Post("/login", controllers.Login)

	api := app.Group("/api", middleware.Auth)

	// admin
	admin := api.Group("/admin", middleware.Admin)
	admin.Post("/user", controllers.AdminCreate)
	admin.Put("/user/:id", controllers.AdminUpdate)
	admin.Delete("/user/:id", controllers.DeleteUser)
	admin.Get("/user", controllers.GetUser)

	// kursus & modul (read)
	api.Get("/kursus", controllers.GetKursus)
	api.Get("/kursus/:id", controllers.GetKursus)
	api.Get("/modul", controllers.GetModul)
	api.Get("/modul/:id", controllers.GetModul)
	api.Get("/soal", controllers.GetSoal)
	api.Get("/soal/:id", controllers.GetSoal)

	// nilai
	api.Get("/progres/:user_id", controllers.GetProgresUser)
	api.Post("/progres/done", controllers.MarkDone)
	api.Post("/nilai/submit", controllers.Nilai)

	// guru

	guru := api.Group("/", middleware.Guru)

	// kursus (write)
	guru.Post("/kursus", controllers.CreateKursus)
	guru.Put("/kursus/:id", controllers.UpdateKursus)
	guru.Delete("/kursus/:id", controllers.DeleteKursus)

	// modul (write)
	guru.Post("/modul", controllers.CreateModul)
	guru.Put("/modul/:id", controllers.UpdateModul)
	guru.Delete("/modul/:id", controllers.DeleteModul)

	// soal (write)
	guru.Post("/soal", controllers.CreateSoal)
	guru.Put("/soal/:id", controllers.UpdateSoal)
	guru.Delete("/soal/:id", controllers.DeleteSoal)

}
