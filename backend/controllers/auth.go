package controllers

import (
	"os"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
	"github.com/irfanCode-code/kursku/backend/config"
	"github.com/irfanCode-code/kursku/backend/models"
	"golang.org/x/crypto/bcrypt"
)

func Register(c fiber.Ctx) error {
	type Request struct {
		Nama     string `json:"nama"`
		Email    string `json:"email"`
		Password string `json:"password"`
		Role     string `json:"role"`
	}

	var input Request
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format data tidak valid",
		})
	}

	if input.Nama == "" || input.Email == "" || input.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "nama, email, dan password harus diisi",
		})
	}

	var totalUser int64
	config.DB.Model(&models.User{}).Where("email = ?", input.Email).Count(&totalUser)
	if totalUser > 0 {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{
			"message": "Email sudah digunakan",
		})
	}

	hashPass, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal membuat akun",
		})
	}

	newUser := models.User{
		Nama:     input.Nama,
		Email:    input.Email,
		Password: string(hashPass),
		Role:     "siswa",
	}
	if err := config.DB.Create(&newUser).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal membuat akun",
		})
	}
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "registrasi berhasil silahkan login ya",
		"data": fiber.Map{
			"id":       newUser.ID,
			"nama":     newUser.Nama,
			"password": newUser.Password,
			"role":     newUser.Role,
		},
	})
}

func Login(c fiber.Ctx) error {
	type LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	var input LoginRequest
	if err := c.Bind().Body(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "format data tidak valid",
		})
	}

	if input.Email == "" || input.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "email dan password harus diisi",
		})
	}

	var user models.User
	err := config.DB.Where("email = ?", input.Email).First(&user).Error
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "email atau password salah",
		})
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password))
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "email atau password salah",
		})
	}

	claims := jwt.MapClaims{
		"user_id": user.ID,
		"role":    user.Role,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	secretKey := os.Getenv("JWT_SECRET")
	signedToken, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal membuat token",
		})
	}

	return c.JSON(fiber.Map{
		"message": "Login berhasil",
		"token":   signedToken,
		"user": fiber.Map{
			"id":    user.ID,
			"nama":  user.Nama,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func GetUserProfil(c fiber.Ctx) error {
	userID := c.Params("id")
	var user models.User

	if err := config.DB.First(&user, userID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "user tidak ditemukan",
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil user",
		"data": fiber.Map{
			"id":    user.ID,
			"nama":  user.Nama,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}

func GetKursusSiswa(c fiber.Ctx) error {
	kursusID := c.Params("id")
	var partisipasi []models.Progress

	err := config.DB.Preload("siswa").Where("kursus_id = ?", kursusID).Find(&partisipasi).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "gagal mengambil data kursus",
		})
	}

	type SiswaFormat struct {
		ID       uint    `json:"id"`
		Nama     string  `json:"nama"`
		Email    string  `json:"email"`
		Progress float32 `json:"progress"`
	}

	var siswaList []SiswaFormat
	for _, p := range partisipasi {
		siswaList = append(siswaList, SiswaFormat{
			ID:       p.SiswaID,
			Nama:     p.Siswa.Nama,
			Email:    p.Siswa.Email,
			Progress: p.Progress,
		})
	}

	return c.JSON(fiber.Map{
		"message": "berhasil mengambil daftar anggota",
		"total":   len(siswaList),
	})
}
