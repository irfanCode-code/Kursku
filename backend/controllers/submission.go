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

func CreateSubmission(c fiber.Ctx) error {
	userRole := c.Locals("role")
	if userRole != "siswa" {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"message": "hanya siswa yang dapat mengumpulkan tugas",
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
			"message": "sesi tidak valid, silakan login kembali",
		})
	}

	modulIDstr := c.Params("id")

	if modulIDstr == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "modul id tidak ditemukan",
		})
	}

	modulID64, err := strconv.ParseUint(modulIDstr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format modul tidak valid",
		})
	}

	modulID := uint(modulID64)

	var modul models.Modul
	if err := config.DB.First(&modul, modulID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "modul tidak ditemukan",
		})
	}

	file, err := c.FormFile("file")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "file .pdf wajib diunggah",
		})
	}

	ext := filepath.Ext(file.Filename)
	if ext != ".pdf" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "file harus berformat .pdf",
		})
	}

	uploadDir := "./uploads/submissions"
	if err := os.MkdirAll(uploadDir, os.ModePerm); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menyiapkan folder penyimpanan di server",
		})
	}

	uniqueFileName := fmt.Sprintf("tugas_%d_user_%d_%d%s", modulID, siswaID, time.Now().Unix(), ext)
	filePath := filepath.Join(uploadDir, uniqueFileName)

	if err := c.SaveFile(file, filePath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menyimpan file jawaban ke server",
		})
	}

	newSubmission := models.Submission{
		FileUrl: filePath,
		Grade:   0.0,
		ModulID: modulID,
		SiswaID: siswaID,
	}

	if err := config.DB.Create(&newSubmission).Error; err != nil {
		os.Remove(filePath)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengirimkan tugas ke database",
		})
	}
	_ = AutoProgress(siswaID, modul.KursusID)

	return c.JSON(fiber.Map{
		"message": "berhasil mengirimkan tugas",
		"data":    newSubmission,
	})
}

func UpdateSubmission(c fiber.Ctx) error {
	submissionID := c.Params("id")
	var submission models.Submission

	if err := config.DB.First(&submission, submissionID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "tugas tidak ditemukan",
		})
	}

	gradeStr := c.FormValue("grade")
	if gradeStr != "" {
		var newGrade float32
		_, err := fmt.Sscanf(gradeStr, "%f", newGrade)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "format harus berupa angka desimal",
			})
		}
		submission.Grade = newGrade
	}

	file, err := c.FormFile("file")
	if err == nil {
		ext := filepath.Ext(file.Filename)
		if ext != ".pdf" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"message": "format tidak mendukung! harus .pdf",
			})
		}

		uploadDir := "./uploads/submissions"
		uniqueFileName := fmt.Sprintf("tugas_update_%d_%s", time.Now().Unix(), file.Filename)
		newFilePath := filepath.Join(uploadDir, uniqueFileName)
		if err := c.SaveFile(file, newFilePath); err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal update file",
			})
		}
		if submission.FileUrl != "" {
			_ = os.Remove(submission.FileUrl)
		}
		submission.FileUrl = newFilePath
	}

	if err := config.DB.Save(&submission).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal memperbarui tugas ke database",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil memperbarui tugas",
		"data":    submission,
	})
}

func DeleteSubmission(c fiber.Ctx) error {
	SubmissionID := c.Params("id")
	var submission models.Submission

	if err := config.DB.First(&submission, SubmissionID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "data tugas tidak ditemukan",
		})
	}

	if submission.FileUrl != "" {
		err := os.Remove(submission.FileUrl)
		if err != nil {
			fmt.Printf("gagal menghapus file")
		}
	}

	if err := config.DB.Unscoped().Delete(&submission).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal menghapus file tugas",
		})
	}

	_ = AutoProgress(submission.SiswaID, submission.Modul.KursusID)

	return c.JSON(fiber.Map{
		"message": "file tugas berhasil dihapus",
	})
}

func GetSubmissionByModul(c fiber.Ctx) error {
	modulID := c.Params("modul_id")
	var submission []models.Submission

	err := config.DB.Preload("Siswa").Where("modul_id = ?", modulID).Find(&submission).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengambil tugas yang dikumpulkan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil tugas yang dikumpulkan",
		"total":   len(submission),
		"data":    submission,
	})
}

func GetSubmissionById(c fiber.Ctx) error {
	submissionID := c.Params("id")
	var submission models.Submission

	err := config.DB.Preload("siswa").Preload("modul").First(&submission, submissionID).Error
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "tugas tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil tugas",
		"data":    submission,
	})
}
