import { Router } from 'express'
import { getProfile, createUser, loginUser, updateProfile, updateImage, getFile } from '../controllers/userController'
import { authenticateJWT } from '../middleware/jwtMiddleware'
import { validateUserRegistration, validationLogin } from '../middleware/validation'
import upload from '../middleware/upload'
import { getList as getListBanner } from '../controllers/bannerController'
import { getList as getListService } from '../controllers/serviceController'
const router = Router()

/**
 * @openapi
 * /api/v1/register:
 *   post:
 *     tags:
 *       - 1. Module Membership
 *     security: []
 *     description: |
 *       **Public Registration API**  
 * 
 *       Digunakan untuk melakukan registrasi User agar bisa Login kedalam aplikasi.  
 * 
 *       Tidak perlu token untuk mengakses API ini.  
 *       
 *       **Ketentuan:**
 *       - Parameter `email` harus dalam format email yang valid.
 *       - Parameter `password` harus memiliki panjang minimal 8 karakter.
 *       - Handling Response sesuai dokumentasi Response dibawah
 *      
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joko@gmail.com"
 *               first_name:
 *                 type: string
 *                 example: "joko"
 *               last_name:
 *                 type: string
 *                 example: "parminto"
 *               password:
 *                 type: string
 *                 example: "adminadmin"
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silahkan login"
 *                 data:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Paramter email tidak sesuai format"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.post('/register', validateUserRegistration, createUser)

/**
 * @openapi
 * /api/v1/login:
 *   post:
 *     tags:
 *       - 1. Module Membership
 *     security: []
 *     description: |
 *       **API Login Public (Tidak perlu Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk melakukan login dan mendapatkan authentication berupa JWT (Json Web Token)
 *       
 *       **Ketentuan:**
 *       - Parameter request `email` harus terdapat validasi format email
 *       - Parameter request `password` Length minimal 8 karakter
 *       - `JWT` yang digenerate harus memuat payload `email` dan di set `expiration` selama 12 jam dari waktu di generate
 *       
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "joko@gmail.com"
 *               password:
 *                 type: string
 *                 example: "adminadmin"
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silakan login"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Paramter email tidak sesuai format"
 *                 data:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 103
 *                 message:
 *                   type: string
 *                   example: "Username atau password salah"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.post('/login', validationLogin, loginUser)

/**
 * @openapi
 * /api/v1/profile:
 *   get:
 *     tags:
 *       - 1. Module Membership
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Profile Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mendapatkan informasi profile User 
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan `Bearer Token JWT` untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Handling Response sesuai dokumentasi Response dibawah
 *       
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silakan login"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "joko@gmail.com"
 *                     first_name:
 *                       type: string
 *                       example: "joko"
 *                     last_name:
 *                       type: string
 *                       example: "parminto"
 *                     profile_image:
 *                       type: string
 *                       example: "https://myprofile.com/image.jpg"
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.get('/profile', authenticateJWT, getProfile)

/**
 * @openapi
 * /api/v1/profile/update:
 *   patch:
 *     tags:
 *       - 1. Module Membership
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Update Profile Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mengupdate data profile User
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan `Bearer Token JWT` untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Handling Response sesuai dokumentasi Response dibawah
 *   
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "joko"
 *               last_name:
 *                 type: string
 *                 example: "parminto"
 *     
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silakan login"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "joko@gmail.com"
 *                     first_name:
 *                       type: string
 *                       example: "joko"
 *                     last_name:
 *                       type: string
 *                       example: "parminto"
 *                     profile_image:
 *                       type: string
 *                       example: "https://myprofile.com/image.jpg"
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.patch('/profile/update', authenticateJWT, updateProfile)

/**
 * @openapi
 * /api/v1/profile/image:
 *   patch:
 *     tags:
 *       - 1. Module Membership
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Upload Profile Image Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mengupdate / upload profile image User
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan` Bearer Token JWT` untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Format Image yang boleh di upload hanya `jpeg` dan `png`
 *       - Handling Response sesuai dokumentasi Response dibawah
 *   
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 * 
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Registrasi berhasil silakan login"
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "joko@gmail.com"
 *                     first_name:
 *                       type: string
 *                       example: "joko"
 *                     last_name:
 *                       type: string
 *                       example: "parminto"
 *                     profile_image:
 *                       type: string
 *                       example: "https://myprofile.com/image.jpg"
 * 
 * 
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 102
 *                 message:
 *                   type: string
 *                   example: "Format Image tidak sesuai"
 *                 data:
 *                   type: string
 *                   example: null
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.patch('/profile/image', authenticateJWT, upload.single('file') ,updateImage)

router.get('/uploads/:filename', getFile)


/**
 * @openapi
 * /api/v1/banner:
 *   get:
 *     tags:
 *       - 2. Module Information
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Banner Public (tidak memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mendapatkan list banner
 *       
 *       **Ketentuan:**
 *       - Buat data list banner sesuai dokumentasi Response dibawah, usahakan banner ini tidak di hardcode, melainkan ambil dari database
 *       - Tidak perlu membuatkan module CRUD banner
 *       - Handling Response sesuai dokumentasi Response dibawah
 *       
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Sukses"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       banner_name:
 *                         type: string
 *                         example: "Banner 1"
 *                       banner_image:
 *                         type: string
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       description:
 *                         type: string
 *                         example: "Lerem Ipsum Dolor sit amet"
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.get('/banner', authenticateJWT, getListBanner)


/**
 * @openapi
 * /api/v1/services:
 *   get:
 *     tags:
 *       - 2. Module Information
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Services Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mendapatkan list Service/Layanan PPOB
 *       
 *       **Ketentuan:**
 *       - Buat data list Service/Layanan sesuai dokumentasi Response dibawah, usahakan data list `Service` atau `Layanan` ini tidak di hardcode, melainkan ambil dari database
 *       - Tidak perlu membuatkan module CRUD Service/Layanan
 *       - Handling Response sesuai dokumentasi Response dibawah
 *       
 *     responses:
 *       200:
 *         description: Request Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 0
 *                 message:
 *                   type: string
 *                   example: "Sukses"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       service_code:
 *                         type: string
 *                         example: "PAJAK"
 *                       service_name:
 *                         type: string
 *                         example: "Pajak PBB"
 *                       service_icon:
 *                         type: string
 *                         example: "https://nutech-integrasi.app/dummy.jpg"
 *                       service_tariff:
 *                         type: number
 *                         example: 10000
 * 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: number
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.get('/services', authenticateJWT, getListService)

export { router as routes }
