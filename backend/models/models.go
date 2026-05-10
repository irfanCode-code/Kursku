package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nama     string    `gorm:"type:varchar(100);not null" json:"nama"`
	Email    string    `gorm:"type:varchar(100);not null;uniqueIndex" json:"email"`
	Password string    `gorm:"type:varchar(255);not null" json:"-"`
	Role     string    `gorm:"type:varchar(20);not null" json:"role"`
	Progres  []Progres `gorm:"foreignKey:UserID" json:"progres"`
	Nilai    []Nilai   `gorm:"foreignKey:UserID" json:"nilai"`
}

type Kursus struct {
	gorm.Model
	UserID uint    `gorm:"not null" json:"guru_id"`
	Judul  string  `gorm:"type:varchar(100);not null" json:"judul"`
	Moduls []Modul `gorm:"foreignKey:KursusID" json:"moduls"`
}

type Modul struct {
	gorm.Model
	KursusID uint      `gorm:"not null" json:"kursus_id"`
	Judul    string    `gorm:"type:varchar(255);not null" json:"judul"`
	Konten   string    `gorm:"type:text;not null" json:"konten"`
	Progres  []Progres `gorm:"foreignKey:ModulID" json:"progres"`
	Soals    []Soal    `gorm:"foreignKey:ModulID" json:"soals"`
	Nilai    []Nilai   `gorm:"foreignKey:ModulID" json:"nilai"`
}

type Progres struct {
	gorm.Model
	UserID  uint `gorm:"not null;uniqueIndex:idx_progres_user_modul" json:"user_id"`
	ModulID uint `gorm:"not null;uniqueIndex:idx_progres_user_modul" json:"modul_id"`
	Selesai bool `gorm:"default:false" json:"selesai"`
}

type Soal struct {
	gorm.Model
	ModulID uint   `gorm:"not null" json:"modul_id"`
	Isi     string `gorm:"type:varchar(255);not null" json:"isi"`
	Pilihan string `gorm:"type:json;not null" json:"pilihan"`
	Jawaban string `gorm:"type:varchar(255);not null" json:"jawaban"`
}

type Nilai struct {
	gorm.Model
	UserID  uint `gorm:"not null;uniqueIndex:idx_nilai_user_modul" json:"user_id"`
	ModulID uint `gorm:"not null;uniqueIndex:idx_nilai_user_modul" json:"modul_id"`
	Score   int  `gorm:"not null" json:"score"`
}
