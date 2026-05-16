package controllers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"log"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func AdminCreate(c fiber.Ctx) error {
	var user models.User

	if err := c.Bind().Body(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}

	log.Printf("DEBUG CREATE: password asli dari postman: [%s]", user.Password)

	hashPass, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hashPass)

	if err := config.DB.Create(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menyimpan ke database",
		})
	}
	return c.Status(201).JSON(fiber.Map{
		"message": "berhasil membuat",
		"data":    user.ID,
	})
}

func AdminUpdate(c fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "user tidak ditemukan",
		})
	}

	if err := c.Bind().Body(&user); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak sesuai",
		})
	}
	if user.Password != "" {
		hashPass, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
		user.Password = string(hashPass)
	}

	if err := config.DB.Save(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menyimpan data",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil menyimpan",
		"data":    user.ID,
	})
}

func GetUser(c fiber.Ctx) error {
	id := c.Params("id")

	if id != "" {
		var user models.User
		if err := config.DB.First(&user, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "gagal mengambil data user",
			})
		}
		return c.Status(200).JSON(fiber.Map{
			"message": "berhasil mengambil",
			"data":    user,
		})
	}

	var allUser []models.User

	if err := config.DB.Find(&allUser).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal mengambil data user",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil mengambil",
		"data":    allUser,
	})
}

func DeleteUser(c fiber.Ctx) error {
	id := c.Params("id")
	var user models.User

	if err := config.DB.First(&user, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}
	if err := config.DB.Delete(&user).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menghapus data",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil dihapus",
		"data":    user.ID,
	})
}

func Login(c fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak sesuai",
		})
	}

	var user models.User

	if err := config.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "email salah",
		})
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "password salah",
		})
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	t, err := token.SignedString([]byte("s3cr3t"))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal membuat token",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil login",
		"data":    user.ID,
		"token":   t,
	})
}

func GetKursus(c fiber.Ctx) error {
	id := c.Params("id")

	if id != "" {
		var kursus models.Kursus
		if err := config.DB.Preload("Moduls.Soals").First(&kursus, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "data tidak ditemukan",
			})
		}
		return c.Status(200).JSON(fiber.Map{
			"message": "berhasil mengambil",
			"data":    kursus,
		})
	}

	var allKursus []models.Kursus

	if err := config.DB.Find(&allKursus).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal mengambil data",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil mengambil",
		"data":    allKursus,
	})
}

func CreateKursus(c fiber.Ctx) error {
	var kursus models.Kursus

	if err := c.Bind().Body(&kursus); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}

	if err := config.DB.Create(&kursus).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menyimpan ke database",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil membuat",
		"data":    kursus.ID,
	})
}

func UpdateKursus(c fiber.Ctx) error {
	id := c.Params("id")
	var kursus models.Kursus

	if err := config.DB.First(&kursus, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}

	if err := c.Bind().Body(&kursus); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak sesuai",
		})
	}

	if err := config.DB.Save(&kursus).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menyimpan ke database",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil update kursus",
		"data":    kursus.ID,
	})
}

func DeleteKursus(c fiber.Ctx) error {
	id := c.Params("id")
	var kursus models.Kursus

	if err := config.DB.First(&kursus, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}

	if err := config.DB.Delete(&kursus).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menghapus",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil menghapus",
		"data":    kursus.ID,
	})
}

func GetModul(c fiber.Ctx) error {
	id := c.Params("id")

	if id != "" {
		var modul models.Modul
		if err := config.DB.First(&modul, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "modul tidak ditemukan",
			})
		}
		return c.Status(200).JSON(fiber.Map{
			"message": "berhasil mengambil data",
			"data":    modul,
		})
	}

	var allModul []models.Modul

	if err := config.DB.Find(&allModul).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal mengambil data",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil mengambil data",
		"data":    allModul,
	})
}

func CreateModul(c fiber.Ctx) error {
	var modul models.Modul

	if err := c.Bind().Body(&modul); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}
	if err := config.DB.Create(&modul).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal membuat modul baru",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil membuat",
		"data":    modul.ID,
	})
}

func UpdateModul(c fiber.Ctx) error {
	id := c.Params("id")
	var modul models.Modul

	if err := config.DB.First(&modul, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}
	if err := c.Bind().Body(&modul); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}
	if err := config.DB.Save(&modul).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal update modul",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil update modul",
		"data":    modul.ID,
	})
}

func DeleteModul(c fiber.Ctx) error {
	id := c.Params("id")
	var modul models.Modul

	if err := config.DB.First(&modul, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}
	if err := config.DB.Delete(&modul).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menghapus data",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil menghapus",
		"data":    modul.ID,
	})
}

func GetProgresUser(c fiber.Ctx) error {
	userId := c.Params("user_id")
	var progres []models.Progres

	if err := config.DB.Where("user_id = ? AND selesai = ?", userId, true).Find(&progres).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal mengambil data progres",
		})
	}

	return c.JSON(fiber.Map{
		"data": progres,
	})
}

func MarkDone(c fiber.Ctx) error {
	userID := uint(c.Locals("user_id").(float64))

	var input struct {
		ModulID uint `json:"modul_id"`
	}

	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}
	progres := models.Progres{}

	if err := config.DB.Where(models.Progres{UserID: userID, ModulID: input.ModulID}).Assign(models.Progres{Selesai: true}).FirstOrCreate(&progres).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menyimpan ke database",
		})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "modul berhasil diselesaikan",
		"data":    input.ModulID,
	})
}

func CreateSoal(c fiber.Ctx) error {
	var soal models.Soal

	if err := c.Bind().Body(&soal); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}

	var pilihan []string
	err := json.Unmarshal([]byte(soal.Pilihan), &pilihan)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format harus berupa array",
		})
	}

	if len(pilihan) > 6 {
		return c.Status(400).JSON(fiber.Map{
			"message": "maksimal 6 pilihan",
		})
	}

	if err := config.DB.Create(&soal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal membuat",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil membuat",
		"data":    soal.ID,
	})
}

func GetSoal(c fiber.Ctx) error {
	id := c.Params("id")

	if id != "" {
		var soal models.Soal
		if err := config.DB.First(&soal, id).Error; err != nil {
			return c.Status(404).JSON(fiber.Map{
				"message": "data tidak ditemukan",
			})
		}
		return c.Status(200).JSON(fiber.Map{
			"message": "berhasil mengambil data",
			"data":    soal,
		})
	}

	var allSoal []models.Soal

	if err := config.DB.Find(&allSoal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal mengambil data",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil mengambil semua data",
		"data":    allSoal,
	})
}

func UpdateSoal(c fiber.Ctx) error {
	id := c.Params("id")
	var soal models.Soal

	if err := config.DB.First(&soal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}
	if err := c.Bind().Body(&soal); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}
	if err := config.DB.Save(&soal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal update soal",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil update data",
		"data":    soal.ID,
	})
}

func DeleteSoal(c fiber.Ctx) error {
	id := c.Params("id")
	var soal models.Soal

	if err := config.DB.First(&soal, id).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{
			"message": "data tidak ditemukan",
		})
	}
	if err := config.DB.Delete(&soal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menghapus soal",
		})
	}
	return c.Status(200).JSON(fiber.Map{
		"message": "berhasil menghapus data",
		"data":    soal.ID,
	})
}

func Nilai(c fiber.Ctx) error {
	val := c.Locals("user_id")
	if val == nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "unauthorized",
		})
	}
	userID := uint(val.(float64))

	type jawabanInput struct {
		ModulID      uint `json:"modul_id"`
		JawabanSiswa []struct {
			SoalID  uint   `json:"soal_id"`
			Jawaban string `json:"jawaban"`
		} `json:"jawaban_siswa"`
	}

	var input jawabanInput
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{
			"message": "format tidak valid",
		})
	}

	var totalBenar int
	var daftarSoal []models.Soal

	if err := config.DB.Where("modul_id = ?", input.ModulID).Find(&daftarSoal).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal mengambil soal",
		})
	}

	for _, soal := range daftarSoal {
		for _, jawab := range input.JawabanSiswa {
			if jawab.SoalID == soal.ID {
				if jawab.Jawaban == soal.Jawaban {
					totalBenar++
				}
			}
		}
	}

	score := 0
	if len(daftarSoal) > 0 {
		score = (totalBenar * 100) / len(daftarSoal)
	}

	hasil := models.Nilai{}

	if err := config.DB.Where(models.Nilai{UserID: userID, ModulID: input.ModulID}).Assign(models.Nilai{Score: score}).FirstOrCreate(&hasil).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"message": "gagal menyimpan nilai",
		})
	}
	return c.Status(201).JSON(fiber.Map{
		"message": "soal selesai",
		"score":   score,
		"benar":   totalBenar,
		"total":   len(daftarSoal),
	})
}
