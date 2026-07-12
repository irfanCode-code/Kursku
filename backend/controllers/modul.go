package controllers

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/irfanCode-code/kursku/backend/config"
	"github.com/irfanCode-code/kursku/backend/models"
)

func CreateModul(c fiber.Ctx) error {
	judul := c.FormValue("judul")
	deskripsi := c.FormValue("deskripsi")
	kursusIDstr := c.FormValue("kursus_id")
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

	if userRole != "guru" || guruID == 0 {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "hanya guru yang bisa buat modul",
		})
	}

	if judul == "" || kursusIDstr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "judul dan kursus id wajib diisi",
		})
	}

	var kursusID uint
	_, err := fmt.Sscanf(kursusIDstr, "%d", &kursusID)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format kursus id tidak valid",
		})
	}

	var kursus models.Kursus
	if err := config.DB.Where("id = ? AND guru_id = ?", kursusID, guruID).First(&kursus).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "kamu tidak memiliki akses untuk membuat modul",
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "File PDF soal wajib diunggah",
		})
	}

	ext := filepath.Ext(file.Filename)
	if ext != ".pdf" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format file tidak mendukung",
		})
	}

	uploadDir := "./uploads/modules"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menyimpan folder file ke server",
		})
	}

	uniqueFileName := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
	filePath := filepath.Join(uploadDir, uniqueFileName)

	if err := c.SaveFile(file, filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menyimpan file pdf ke server",
		})
	}

	newModul := models.Modul{
		Judul:     judul,
		Deskripsi: deskripsi,
		FileUrl:   filePath,
		KursusID:  kursusID,
	}

	if err := config.DB.Create(&newModul).Error; err != nil {
		os.Remove(filePath)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menyimpan data modul ke database",
		})
	}

	return c.JSON(fiber.Map{
		"message": "modul berhasil ditambahkan",
		"data":    newModul,
	})
}

func UpdateModul(c fiber.Ctx) error {
	modulID := c.Params("id")
	userRoleID := c.Locals("role")

	if userRoleID != "guru" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "hanya guru yang bisa melakukan update modul",
		})
	}

	userIDLocal := c.Locals("user_id")
	var guruID uint
	if idFloat, ok := userIDLocal.(float64); ok {
		guruID = uint(idFloat)
	} else if idInt, ok := userIDLocal.(int); ok {
		guruID = uint(idInt)
	} else if idUint, ok := userIDLocal.(uint); ok {
		guruID = idUint
	}

	if guruID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "sesi tidak valid silahkan login kembali",
		})
	}

	var modul models.Modul

	if err := config.DB.First(&modul, modulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
		})
	}
	var kursus models.Kursus
	err := config.DB.Where("id = ? AND guru_id = ?", modul.KursusID, guruID).First(&kursus).Error
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "kamu tidak memiliki akses untuk merubah modul ini",
		})
	}

	judul := c.FormValue("judul")
	deskripsi := c.FormValue("deskripsi")
	if judul != "" {
		modul.Judul = judul
	}
	if deskripsi != "" {
		modul.Deskripsi = deskripsi
	}

	file, err := c.FormFile("file")
	if err == nil {
		ext := filepath.Ext(file.Filename)
		if ext != ".pdf" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "file tidak mendukung. hanya bisa .pdf",
			})
		}

		uploadDir := "./uploads/modules"
		uniqueFileName := fmt.Sprintf("%d_%s", time.Now().Unix(), file.Filename)
		newFilePath := filepath.Join(uploadDir, uniqueFileName)

		if err := c.SaveFile(file, newFilePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal menyimpan file baru ke server",
			})
		}

		if modul.FileUrl != "" {
			_ = os.Remove(modul.FileUrl)
		}

		modul.FileUrl = newFilePath
	}

	if err := config.DB.Save(&modul).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal memperbarui modul",
		})
	}

	return c.JSON(fiber.Map{
		"message": "modul berhasil diperbarui",
		"data":    modul,
	})
}

func DeleteModul(c fiber.Ctx) error {
	modulID := c.Params("id")
	userRole := c.Locals("role")

	if userRole != "guru" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "hanya guru yang bisa menghapus modul ini",
		})
	}

	userIDLocal := c.Locals("user_id")
	var guruID uint
	if idFloat, ok := userIDLocal.(float64); ok {
		guruID = uint(idFloat)
	} else if idInt, ok := userIDLocal.(int); ok {
		guruID = uint(idInt)
	} else if idUint, ok := userIDLocal.(uint); ok {
		guruID = idUint
	}

	if guruID == 0 {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "sesi telah habis silahkan login kembali",
		})
	}

	var modul models.Modul
	if err := config.DB.First(&modul, modulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
		})
	}

	var kursus models.Kursus
	err := config.DB.Where("id = ? AND guru_id = ?", modul.KursusID, guruID).First(&kursus).Error
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "kamu tidak memiliki akses untuk menghapus modul ini",
		})
	}

	if modul.FileUrl != "" {
		err := os.Remove(modul.FileUrl)
		if err != nil {
			fmt.Printf("gagal menghapus file fisik")
		}
	}

	if err := config.DB.Unscoped().Delete(&modul).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menghapus modul dari database",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil menghapus modul",
	})
}

func GetAllModul(c fiber.Ctx) error {
	userRole := c.Locals("role")
	kursusIDStr := c.Params("kursus_id")
	kursusID64, _ := strconv.ParseUint(kursusIDStr, 10, 32)
	currentKursusID := uint(kursusID64)

	userIDLocal := c.Locals("user_id")
	var currentUserID uint
	if idFloat, ok := userIDLocal.(float64); ok {
		currentUserID = uint(idFloat)
	} else if idInt, ok := userIDLocal.(int); ok {
		currentUserID = uint(idInt)
	} else if idUint, ok := userIDLocal.(uint); ok {
		currentUserID = idUint
	}

	if userRole == "siswa" {
		if !IsSiswaEnrolled(currentUserID, currentKursusID) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "kamu tidak ada di kelas",
			})
		}

		var moduls []models.Modul
		if err := config.DB.Where("kursus_id = ?", currentKursusID).Find(&moduls).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal mengambil modul di kursus ini",
			})
		}

		return c.JSON(fiber.Map{
			"message": "berhasil mengambil daftar modul",
			"total":   len(moduls),
			"data":    moduls,
		})
	}

	if userRole == "guru" {
		var kursus models.Kursus
		if err := config.DB.First(&kursus, currentKursusID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "kursus tidak ditemukan",
			})
		}

		if kursus.GuruID != currentUserID {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "kamu tidak berhak melihat modul dari kelas milik guru lain",
			})
		}

		var modul []models.Modul
		if err := config.DB.Where("kursus_id = ?", currentKursusID).Find(&modul).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal mengambil daftar modul di kursus ini",
			})
		}

		return c.JSON(fiber.Map{
			"message": "berhasil mengambil daftar modul",
			"total":   len(modul),
			"data":    modul,
		})
	}
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "role tidak ditemukan",
	})
}

func GetModulById(c fiber.Ctx) error {
	modulIDstr := c.Params("id")
	userRole := c.Locals("role")

	userIDLocal := c.Locals("user_id")
	var currentUserID uint
	if idFloat, ok := userIDLocal.(float64); ok {
		currentUserID = uint(idFloat)
	} else if idInt, ok := userIDLocal.(int); ok {
		currentUserID = uint(idInt)
	} else if idUint, ok := userIDLocal.(uint); ok {
		currentUserID = idUint
	}

	modulID64, err := strconv.ParseUint(modulIDstr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format id modul tidak valid",
		})
	}
	modulID := uint(modulID64)

	var modul models.Modul

	if err := config.DB.First(&modul, modulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
		})
	}

	if userRole == "siswa" {
		if !IsSiswaEnrolled(currentUserID, modul.KursusID) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "akses ditolak! kamu tidak terdaftar di kelas kursus ini",
			})
		}

		return c.JSON(fiber.Map{
			"message": "berhasil mengambil data modul",
			"data":    modul,
		})
	}

	if userRole == "guru" {
		var kursus models.Kursus
		if err := config.DB.First(&kursus, modul.KursusID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "data kursus dari modul ini tidak ditemukan",
			})
		}

		if kursus.GuruID != currentUserID {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "kamu tidak berhak melihat detail modul dari kelas milik guru lain",
			})
		}

		return c.JSON(fiber.Map{
			"message": "berhasil mengambil data modul",
			"data":    modul,
		})
	}

	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "role tidak ditemukan",
	})
}
