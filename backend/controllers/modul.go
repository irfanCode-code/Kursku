package controllers

import (
	"fmt"
	"os"
	"path/filepath"
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
	var modul models.Modul

	if err := config.DB.First(&modul, modulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
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
	var modul models.Modul

	if err := config.DB.First(&modul, modulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
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
	kursusID := c.Params("kursus_id")
	var modul []models.Modul

	if err := config.DB.Where("kursus_id = ?", kursusID).Find(&modul).Error; err != nil {
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

func GetModulById(c fiber.Ctx) error {
	ModulID := c.Params("id")
	var modul models.Modul

	if err := config.DB.First(&modul, ModulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil modul",
		"data":    modul,
	})
}
