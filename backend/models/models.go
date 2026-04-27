package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Nama     string `gorm:"type:varchar(100);not null"`
	Email    string `gorm:"type:varchar(100);unique;not null"`
	Password string `gorm:"not null"`
}

type Course struct {
	gorm.Model
	Judul     string `gorm:"type:varchar(255);not null"`
	Deskripsi string `gorm:"type:text"`
}

type Enrollment struct {
	gorm.Model
	CourseID uint
	UserID   uint
	Course   Course `gorm:"foreignKey:CourseID"`
	User     User   `gorm:"foreignKey:UserID"`
}

type Module struct {
	gorm.Model
	CourseID uint
	Judul    string `gorm:"type:varchar(255);not null"`
	Konten   string `gorm:"type:text"`
}

type Grade struct {
	gorm.Model
	UserID   uint
	ModuleID uint
	Score    float64 `gorm:"type:decimal(5,2)"`
	User     User    `gorm:"foreignKey:UserID"`
	Module   Module  `gorm:"foreignKey:ModuleID"`
}
