package models

import (
	"gorm.io/gorm"
)

type Kursus struct {
	gorm.Model
	Judul     string `gorm:"type:varchar(255);not null" json:"judul"`
	Deskripsi string `gorm:"type:text" json:"deskripsi"`
	JoinCode  string `gorm:"type:varchar(10);unique;not null" json:"join_code"`
	GuruID    uint   `gorm:"not null" json:"guru_id"`
	Guru      User   `gorm:"foreignKey:GuruID" json:"guru"`
}
