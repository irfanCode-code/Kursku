package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nama     string `gorm:"type:varchar(100);not null" json:"nama"`
	Email    string `gorm:"type:varchar(100);unique;not null" json:"email"`
	Password string `gorm:"type:varchar(255);not null" json:"-"`
	Role     string `gorm:"type:enum('admin', 'guru', 'siswa');default:'siswa'" json:"role"`
}
