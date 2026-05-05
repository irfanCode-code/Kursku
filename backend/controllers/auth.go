package controllers

import (
	"backend/config"
	"backend/models"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Register(c fiber.Ctx) error {
	var data map[string]string
	if err := c.Bind().Body(&data); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Format tidak valid"})
	}

	if data["password"] == "" || data["email"] == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "password dan email wajib diisi"})
	}

	var existingUser models.User
	config.DB.Where("email = ?", data["email"]).First(&existingUser)
	if existingUser.ID != 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"message": "Email sudah digunakan"})
	}

	passwordHash, _ := bcrypt.GenerateFromPassword([]byte(data["password"]), 10)

	user := models.User{
		Nama:     data["nama"],
		Email:    data["email"],
		Password: string(passwordHash),
	}

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "Gagal membuat user baru"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Registrasi berhasil",
		"user": fiber.Map{
			"id":    user.ID,
			"nama":  user.Nama,
			"email": user.Email,
		},
	})
}

var jwtSecret = []byte("secret_kursku")

func Login(c fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "input tidak valid"})
	}

	var user models.User
	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "email tidak ditemukan"})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"message": "password salah"})
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString(jwtSecret)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"message": "gagal membuat token"})
	}

	return c.JSON(fiber.Map{
		"message": "Login berhasil",
		"token":   t,
	})
}

func CreateCourse(c fiber.Ctx) error {
	course := new(models.Course)

	if err := c.Bind().Body(course); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Data tidak valid",
		})
	}

	if err := config.DB.Create(&course).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal membuat kursus",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "kursus sudah dibuat",
		"data":    course,
	})
}

func GetCourses(c fiber.Ctx) error {
	var courses []models.Course

	config.DB.Preload("Modules").Find(&courses)
	return c.JSON(courses)
}

func GetCourseByID(c fiber.Ctx) error {
	id := c.Params("id")
	var course models.Course

	if err := config.DB.First(&course, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "kursus tidak ditemukan"})
	}

	return c.JSON(course)
}

func UpdateCourse(c fiber.Ctx) error {
	id := c.Params("id")
	var course models.Course

	if err := config.DB.First(&course, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"message": "kursus tidak ditemukan"})
	}

	if err := c.Bind().Body(&course); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"message": "Input tidak valid"})
	}

	config.DB.Save(&course)
	return c.JSON(fiber.Map{
		"message": "kursus berhasil diperbarui",
		"data":    course,
	})
}

func DeleteCourse(c fiber.Ctx) error {
	id := c.Params("id")
	var course models.Course

	if err := config.DB.First(&course, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": " kursus tidak ditemukan",
		})
	}
	config.DB.Delete(&course)

	return c.JSON(fiber.Map{
		"message": "kursus berhasil dihapus",
	})
}
