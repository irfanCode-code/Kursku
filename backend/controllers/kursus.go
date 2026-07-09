package controllers

import (
	"github.com/gofiber/fiber/v3"
	"github.com/irfanCode-code/kursku/backend/config"
	"github.com/irfanCode-code/kursku/backend/models"
)

func CreateKursus(c fiber.Ctx) error {
	type KursusRequest struct {
		Judul     string `json:"judul"`
		Deskripsi string `json:"deskripsi"`
		GuruID    uint   `json:"guru_id"`
	}

	var input KursusRequest
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format data tidak valid",
		})
	}

	if input.Judul == "" || input.GuruID == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "judul dan guru_id harus diisi",
		})
	}

	var user models.User
	if err := config.DB.First(&user, input.GuruID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "guru tidak ditemukan",
		})
	}

	if user.Role == "siswa" {
		err := config.DB.Model(&user).Update("role", "guru").Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal memperbarui role",
			})
		}
	}

	generateCode := "KURS-" + user.Nama[:2] + "77"

	newKursus := models.Kursus{
		Judul:     input.Judul,
		Deskripsi: input.Deskripsi,
		JoinCode:  generateCode,
		GuruID:    user.ID,
	}

	if err := config.DB.Create(&newKursus).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal membuat kursus baru",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "berhasil membuat kursus baru",
		"kursus":  newKursus,
	})
}

func UpdateKursus(c fiber.Ctx) error {
	kursusID := c.Params("id")

	type UpdateCourseRequest struct {
		Judul     string `json:"judul"`
		Deskripsi string `json:"deskripsi"`
	}

	var input UpdateCourseRequest
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format data tidak valid",
		})
	}

	var kursus models.Kursus
	if err := config.DB.First(&kursus, kursusID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "kursus tidak ditemukan",
		})
	}

	updateData := models.Kursus{
		Judul:     input.Judul,
		Deskripsi: input.Deskripsi,
	}

	if err := config.DB.Model(&kursus).Updates(updateData).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal memperbarui data",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil memperbarui data",
		"kursus":  kursus,
	})
}

func DeleteKursus(c fiber.Ctx) error {
	kursusID := c.Params("id")

	var kursus models.Kursus
	if err := config.DB.First(&kursus, kursusID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}

	if err := config.DB.Delete(&kursus).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menghapus",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil menghapus",
	})
}

func GetAllKursus(c fiber.Ctx) error {
	var kursus []models.Kursus

	if err := config.DB.Preload("guru").Find(&kursus).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengambil semua data",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil semua data",
		"data":    kursus,
	})
}

func GetKursusByID(c fiber.Ctx) error {
	var kursusID = c.Params("id")
	var kursus []models.Kursus

	if err := config.DB.Preload("guru").First(&kursus, kursusID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil menggambil data",
		"kursus":  kursus,
	})
}
