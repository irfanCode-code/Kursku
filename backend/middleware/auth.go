package middleware

import (
	"os"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/golang-jwt/jwt/v5"
)

func Auth(c fiber.Ctx) error {
	auth := c.Get("Authorization")

	if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
		return c.Status(401).JSON(fiber.Map{
			"message": "login dulu",
		})
	}

	tokenString := strings.TrimPrefix(auth, "Bearer ")

	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fiber.ErrUnauthorized
		}
		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return c.Status(401).JSON(fiber.Map{
			"message": "token tidak valid/ kadaluarsa",
		})
	}
	claims := token.Claims.(jwt.MapClaims)
	c.Locals("user_id", claims["user_id"])
	c.Locals("role", claims["role"])

	return c.Next()
}

func Admin(c fiber.Ctx) error {
	role := c.Locals("role")

	if role != "admin" {
		return c.Status(403).JSON(fiber.Map{
			"message": "hanya admin yang bisa",
		})
	}

	return c.Next()
}

func Guru(c fiber.Ctx) error {
	role := c.Locals("role")

	if role != "guru" {
		return c.Status(403).JSON(fiber.Map{
			"message": "hanya guru yang diperbolehkan",
		})
	}

	return c.Next()
}
