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
	userRole := c.Locals("role")

	userIDLocal := c.Locals("user_id")
	var guruID uint
	if idFloat, ok := userIDLocal.(float64); ok {
		guruID = uint(idFloat)
	} else if idInt, ok := userIDLocal.(int); ok {
		guruID = uint(idInt)
	} else if idUint, ok := userIDLocal.(uint); ok {
		guruID = idUint
	}

	var kursus models.Kursus

	if userRole != "guru" || guruID == 0 {
		if kursus.GuruID != guruID {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "hanya guru yang bisa update",
			})
		}
	}

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

	if err := config.DB.First(&kursus, kursusID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "kursus tidak ditemukan",
		})
	}

	err := config.DB.Where("id = ? AND guru_id = ?", kursusID, guruID).First(&kursus).Error
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "kamu tidak memiliki akses ke kelas ini",
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
		JoinCode string `json:"join_code"`
	}

	var input JoinRequest
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}

	userIDLocal := c.Locals("user_id")
	var siswaID uint
	if idFloat, ok := userIDLocal.(float64); ok {
		siswaID = uint(idFloat)
	} else if idInt, ok := userIDLocal.(int); ok {
		siswaID = uint(idInt)
	} else if idUint, ok := userIDLocal.(uint); ok {
		siswaID = idUint
	}

	if siswaID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "harus login dulu",
		})
	}

	var kursus models.Kursus
	if err := config.DB.Where("join_code = ?", input.JoinCode).First(&kursus).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "kode kelas tidak ditemukan",
		})
	}

	var checkProgress []models.Progress

	config.DB.Where("kursus_id = ? AND siswa_id = ?", kursus.ID, siswaID).Limit(1).Find(&checkProgress)

	if len(checkProgress) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "kamu sudah bergabung di kelas ini",
		})
	}

	newProgress := models.Progress{
		SiswaID:  siswaID,
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
	siswaID := c.Locals("user_id")
	var daftar []models.Progress

	if err := config.DB.Preload("Kursus").Where("siswa_id = ?", siswaID).Find(&daftar).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengambil kelas yang diikuti",
		})
	}

	daftarDiikuti := make([]models.Kursus, 0)
	for _, e := range daftar {
		if e.Kursus.ID != 0 {
			daftarDiikuti = append(daftarDiikuti, e.Kursus)
		}
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil daftar yang diikuti",
		"total":   len(daftarDiikuti),
		"data":    daftarDiikuti,
	})
}
