package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/irfanCode-code/kursku/backend/config"
	"github.com/irfanCode-code/kursku/backend/models"
)

func AutoProgress(siswaID uint, kursusID uint) error {
	var totalModul int64
	err := config.DB.Model(&models.Modul{}).Where("kursus_id = ?", kursusID).Count(&totalModul).Error
	if err != nil {
		return err
	}

	if totalModul == 0 {
		return nil
	}

	var totalSubmission int64
	err = config.DB.Model(&models.Submission{}).Joins("JOIN moduls ON submissions.modul_id = moduls_id").Where("submissions.siswa_id = ? AND moduls.kursus_id = ?", siswaID, kursusID).Count(&totalSubmission).Error
	if err != nil {
		return err
	}

	newProgress := (float32(totalSubmission) / float32(totalModul)) * 100.0

	err = config.DB.Model(&models.Progress{}).Where("siswa_id = ? AND kursus_id = ?", siswaID, kursusID).Update("progress", newProgress).Error

	return err
}

func GetSiswaProgress(c fiber.Ctx) error {
	kursusIDstr := c.Params("kursus_id")
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

	kursusID64, err := strconv.ParseUint(kursusIDstr, 10, 32)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format id kursus tidak valid",
		})
	}
	kursusID := uint(kursusID64)

	if userRole == "siswa" {
		if !IsSiswaEnrolled(currentUserID, kursusID) {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "kamu belum pernah join kelas ini",
			})
		}
		var progress models.Progress
		err = config.DB.Where("siswa_id = ? AND kursus_id = ?", currentUserID, kursusID).First(&progress).Error
		if err != nil {

			return c.JSON(fiber.Map{
				"message": "berhasil mengambil progress belajar",
				"data": fiber.Map{
					"kursus_id":  kursusID,
					"siswa_id":   currentUserID,
					"percentage": 0.0,
				},
			})
		}
		return c.JSON(fiber.Map{
			"message": "berhasil mengambil progress belajar kamu",
			"data":    progress,
		})
	}

	if userRole == "guru" {
		var kursus models.Kursus
		if err := config.DB.First(&kursus, kursusID).Error; err != nil {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"message": "kursus tidak ditemukan",
			})
		}

		if kursus.GuruID != currentUserID {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
				"message": "kamu tidak berhak melihat progress kursus milik guru lain",
			})
		}

		var allProgress []models.Progress
		err = config.DB.Preload("Siswa").Where("kursus_id = ?", kursusID).Find(&allProgress).Error
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "gagal mengambil data progress siswa",
			})
		}

		return c.JSON(fiber.Map{
			"message": "berhasil mengambil seluruh progress siswa di kursus ini",
			"count":   len(allProgress),
			"data":    allProgress,
		})
	}

	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"message": "role tidak dikenali",
	})
}

func IsSiswaEnrolled(siswaID uint, kursusID uint) bool {
	var count int64
	config.DB.Model(&models.Progress{}).Where("siswa_id = ? AND kursus_id = ?", siswaID, kursusID).Count(&count)
	return count > 0
}
