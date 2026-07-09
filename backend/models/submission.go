package models

import (
	"gorm.io/gorm"
)

type Submission struct {
	gorm.Model
	ModulID uint    `gorm:"not null" json:"modul_id"`
	Modul   Modul   `gorm:"foreignKey:ModulID" json:"-"`
	SiswaID uint    `gorm:"not null" json:"siswa_id"`
	Siswa   User    `gorm:"foreignKey:SiswaID" json:"-"`
	FileUrl string  `gorm:"type:varchar(255);not null" json:"file_url"`
	Grade   float32 `gorm:"type:decimal(5,2);default:0" json:"grade"`
}
