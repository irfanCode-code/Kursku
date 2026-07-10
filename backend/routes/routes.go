package routes

import (
	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/static"
	"github.com/irfanCode-code/kursku/backend/controllers"
)

func SetUp(app *fiber.App) {
	app.Get("/uploads*", static.New("./uploads"))

	api := app.Group("/api")

	// auth
	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
	auth.Get("/profile", controllers.GetUserProfil)
	// kursus
	kursus := api.Group("/kelas")
	kursus.Post("/", controllers.CreateKursus)
	kursus.Get("/", controllers.GetAllKursus)
	kursus.Get("/:id", controllers.GetKursusByID)
	kursus.Put("/:id", controllers.UpdateKursus)
	kursus.Delete("/:id", controllers.DeleteKursus)
	// kelasku & diikuti
	kursus.Get("/kelasku/:guru_id", controllers.GetKelasKu)
	kursus.Post("/join", controllers.JoinKelas)
	kursus.Get("/diikuti/:siswa_id", controllers.GetKelasDiikuti)
	// modul
	modul := api.Group("/modul")
	modul.Post("/", controllers.CreateModul)
	modul.Get("/kursus/:kursus_id", controllers.GetAllModul)
	modul.Get("/:id", controllers.GetModulById)
	modul.Put("/:id", controllers.UpdateModul)
	modul.Delete("/:id", controllers.DeleteModul)
	// submission
	submission := api.Group("/submission")
	submission.Post("/", controllers.CreateSubmission)
	submission.Get("/modul/:modul_id", controllers.GetSubmissionByModul)
	submission.Get("/:id", controllers.GetSubmissionById)
	submission.Put("/:id", controllers.UpdateSubmission)
	submission.Delete("/:id", controllers.DeleteSubmission)
	// progress
	progress := api.Group("/progress")
	progress.Get("/siswa/:siswa_id/kursus/:kursus_id", controllers.GetSiswaProgress)
}
