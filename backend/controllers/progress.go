package controllers

import (
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
	siswaID := c.Params("siswa_id")
	kursusID := c.Params("kursus_id")
	var progress models.Progress

	if err := config.DB.Where("siswa_id = ? AND kursus_id = ?", siswaID, kursusID).First(&progress).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "data progress tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil data progress",
		"data":    progress.Progress,
	})
}
