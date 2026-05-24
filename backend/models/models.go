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
	Point    int       `gorm:"default:0" json:"point"`
	Progres  []Progres `gorm:"foreignKey:UserID" json:"progres"`
	Nilai    []Nilai   `gorm:"foreignKey:UserID" json:"nilai"`
}

type Kursus struct {
	gorm.Model
	UserID   uint    `gorm:"not null" json:"guru_id"`
	Judul    string  `gorm:"type:varchar(100);not null" json:"judul"`
	JoinCode string  `gorm:"type:varchar(10);uniqueIndex" json:"join_code"`
	Moduls   []Modul `gorm:"foreignKey:KursusID" json:"moduls"`
}

type KelasMember struct {
	gorm.Model
	KursusID uint `gorm:"not null;uniqueIndex:idx_kursus_user" json:"kursus_id"`
	UserID   uint `gorm:"not null;uniqueIndex:idx_kursus_user" json:"user_id"`
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

type Post struct {
	gorm.Model
	UserID   uint      `gorm:"not null" json:"user_id"`
	User     User      `gorm:"foreignKey:UserID" json:"-"`
	Judul    string    `gorm:"type:varchar(255);not null" json:"judul"`
	IsiSoal  string    `gorm:"type:text;not null" json:"isi_soal"`
	Comments []Comment `gorm:"foreignKey:PostID" json:"comments"`
}

type Comment struct {
	gorm.Model
	PostID    uint   `gorm:"not null" json:"post_id"`
	UserID    uint   `gorm:"not null" json:"user_id"`
	User      User   `gorm:"foreignKey:UserID" json:"-"`
	IsiKomen  string `gorm:"type:text;not null" json:"isi_komen"`
	LikeCount int    `gorm:"default:0" json:"like_count"`
}

type LikeComment struct {
	gorm.Model
	CommentID uint `gorm:"not null;uniqueIndex:idx_user_comment" json:"comment_id"`
	UserID    uint `gorm:"not null;uniqueIndex:idx_user_comment" json:"user_id"`
}

type ShopItem struct {
	gorm.Model
	NamaItem  string `gorm:"type:varchar(100);not null" json:"nama_item"`
	Deskripsi string `gorm:"type:varchar(255)" json:"deskripsi"`
	HargaPoin int    `gorm:"not null" json:"harga_poin"`
	Tipe      string `gorm:"type:varchar(50);not null" json:"tipe"`
}

type UseTransaction struct {
	gorm.Model
	UserID     uint     `gorm:"not null;uniqueIndex:idx_user_item" json:"user_id"`
	ShopItemID uint     `gorm:"not null;uniqueIndex:idx_user_item" json:"shop_item_id"`
	ShopItem   ShopItem `gorm:"foreignKey:ShopItemID" json:"shop_item"`
}

type KontenKelas struct {
	gorm.Model
	KelasID   uint    `json:"kelas_id"`
	Tipe      string  `json:"tipe"` // "materi" | "tugas"
	Judul     string  `json:"judul"`
	Deskripsi string  `json:"deskripsi"`
	Deadline  *string `json:"deadline"` // nullable
	File      *string `json:"file"`     // nullable, nama file
}

type Kelas struct {
	gorm.Model
	Nama string `json:"nama"`
	Code string `json:"code" gorm:"uniqueIndex"` // kode unik untuk join
}

// KelasAnggota — menyimpan role user PER kelas
// role: "guru" | "siswa"
type KelasAnggota struct {
	gorm.Model
	KelasID uint   `json:"kelas_id"`
	UserID  uint   `json:"user_id"`
	Role    string `json:"role"` // "guru" | "siswa"
}
