package models

import (
	"gorm.io/gorm"
)

type Progress struct {
	gorm.Model
	SiswaID  uint    `gorm:"not null;uniqueIndex:idx_siswa_kursus" json:"siswa_id"`
	Siswa    User    `gorm:"foreignKey:SiswaID" json:"-"`
	KursusID uint    `gorm:"not null;uniqueIndex:idx_siswa_kursus" json:"kursus_id"`
	Kursus   Kursus  `gorm:"foreignKey:KursusID" json:"-"`
	Progress float32 `gorm:"type:decimal(5,2);default:0" json:"progress"`
}
