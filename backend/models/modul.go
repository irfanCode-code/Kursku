package models

import (
	"gorm.io/gorm"
)

type Modul struct {
	gorm.Model
	Judul     string `gorm:"type:varchar(255);not null" json:"judul"`
	Deskripsi string `gorm:"type:text" json:"deskripsi"`
	FileUrl   string `gorm:"type:varchar(255);not null" json:"file_url"`
	KursusID  uint   `gorm:"not null" json:"kursus_id"`
	Kursus    Kursus `gorm:"foreignKey:KursusID" json:"-"`
}
