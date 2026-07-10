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
	}

	var input KursusRequest
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format data tidak valid",
		})
	}

	if input.Judul == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "judul harus diisi",
		})
	}

	var user models.User
	if user.Role == "siswa" {
		err := config.DB.Model(&user).Update("role", "guru").Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal memperbarui role",
			})
		}
	}

	userID := c.Locals("user_id")
	var guruID uint

	if idFloat, ok := userID.(float64); ok {
		guruID = uint(idFloat)
	} else if idInt, ok := userID.(int); ok {
		guruID = uint(idInt)
	}

	generateCode := "KURS-" + generateRandomString(5)

	newKursus := models.Kursus{
		Judul:     input.Judul,
		Deskripsi: input.Deskripsi,
		GuruID:    guruID,
		JoinCode:  generateCode,
	}

	if err := config.DB.Create(&newKursus).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal membuat kursus baru",
		})
	}

	if err := config.DB.Model(&models.User{}).Where("id = ?", newKursus.GuruID).Update("role", "guru").Error; err != nil {
	}

	if err := config.DB.Preload("Guru").First(&newKursus, newKursus.ID).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal memuat data relasi guru",
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

	if err := config.DB.Preload("Guru").Find(&kursus).Error; err != nil {
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

	if err := config.DB.Preload("Guru").First(&kursus, kursusID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil menggambil data",
		"kursus":  kursus,
	})
}

func GetKelasKu(c fiber.Ctx) error {
	guruID := c.Params("guru_id")
	var daftarKursus []models.Kursus

	if err := config.DB.Where("guru_id = ?", guruID).Find(&daftarKursus).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengambil daftar kelasku",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil daftar kelasku",
		"total":   len(daftarKursus),
		"data":    daftarKursus,
	})
}

func JoinKelas(c fiber.Ctx) error {
	type JoinRequest struct {
		SiswaID  uint   `json:"siswa_id"`
		JoinCode string `json:"join_code"`
	}

	var input JoinRequest
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}

	var kursus models.Kursus
	if err := config.DB.Where("join_code = ?", input.JoinCode).First(&kursus).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "kode kelas tidak ditemukan",
		})
	}

	var checkProgress models.Progress
	err := config.DB.Where("kursus_id = ? AND siswa_id = ?", kursus.ID, input.SiswaID).First(&checkProgress).Error
	if err == nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "kamu sudah bergabung di kelas ini",
		})
	}

	newProgress := models.Progress{
		SiswaID:  input.SiswaID,
		KursusID: kursus.ID,
		Progress: 0.0,
	}

	if err := config.DB.Create(&newProgress).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal bergabung",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil bergabung",
		"data":    kursus,
	})
}

func GetKelasDiikuti(c fiber.Ctx) error {
	siswaID := c.Params("siswa_id")
	var daftar []models.Progress

	if err := config.DB.Preload("kursus").Where("siswa_id = ?", siswaID).Find(&daftar).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengambil kelas yang diikuti",
		})
	}

	var daftarDiikuti []models.Kursus
	for _, e := range daftar {
		daftarDiikuti = append(daftarDiikuti, e.Kursus)
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil daftar yang diikuti",
		"total":   len(daftarDiikuti),
		"data":    daftarDiikuti,
	})
}
