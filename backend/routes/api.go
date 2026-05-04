package routes

import (
	"backend/controllers"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
)

func SetupRoutes(app *fiber.App) {
	app.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:8080"},
		AllowHeaders: []string{"Origin, Content-Type, Accept, Authorization"},
		AllowMethods: []string{"GET, POST, PUT, DELETE"},
	}))

	api := app.Group("/api")

	auth := api.Group("/auth")
	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)

	course := api.Group("/courses")
	course.Get("/", controllers.GetCourses)
	course.Get("/:id", controllers.GetCourseByID)
	course.Post("/", controllers.CreateCourse)
	course.Put("/:id", controllers.UpdateCourse)
	course.Delete("/:id", controllers.DeleteCourse)
}
