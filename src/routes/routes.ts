import { Router } from 'express'
import { getProfile, createUser, loginUser, updateProfile, updateImage, getFile } from '../controllers/userController'
import { authenticateJWT } from '../middleware/jwtMiddleware'
import { validateUserRegistration, validationLogin, validationTopup, validationTransaction } from '../middleware/validation'
import upload from '../middleware/upload'
import { getList as getListBanner } from '../controllers/bannerController'
import { getList as getListService } from '../controllers/serviceController'
import { getList, topup } from '../controllers/balanceController'
import { createTrx, getListTrx } from '../controllers/transactionController'
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

/**
 * @openapi
 * /api/v1/balance:
 *   get:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Balance Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mendapatkan informasi balance / saldo terakhir dari User
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan `Bearer Token JWT` untuk mengaksesnya
 *       - Service ini harus menggunakan Bearer Token JWT untuk mengaksesnya
 *       - Handling Response sesuai dokumentasi Response dibawah
 *       
 *     responses:
 *       200:
 *         description: Get Balance / Saldo Berhasil
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
 *                   example: "Get Balance Berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 1000000
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
router.get('/balance', authenticateJWT, getList)

/**
 * @openapi
 * /api/v1/topup:
 *   post:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Topup Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk melakukan top up balance / saldo dari User
 * 
 *       Tidak perlu token untuk mengakses API ini.  
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan `Bearer Token JWT `untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Setiap kali melakukan Top Up maka balance / saldo dari User otomatis bertambah
 *       - Parameter `amount` hanya boleh angka saja dan tidak boleh lebih kecil dari 0
 *       - Pada saat Top Up set transaction_type di database menjadi `TOPUP`
 *       - Handling Response sesuai dokumentasi Response dibawah
 *      
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               top_up_amount:
 *                 type: number
 *                 example: 50000
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
 *                   example: "Top Up Balance berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     balance:
 *                       type: number
 *                       example: 1000000 
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
 *                   example: "Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0"
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
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.post('/topup', validationTopup, authenticateJWT, topup)

/**
 * @openapi
 * /api/v1/transaction:
 *   post:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API Transaction Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk melakukan transaksi dari services / layanan yang tersedia
 * 
 *       Tidak perlu token untuk mengakses API ini.  
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan `Bearer Token JWT` untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Setiap kali melakukan Transaksi harus dipastikan balance / saldo mencukupi
 *       - Pada saat Transaction set transaction_type di database menjadi `PAYMENT`
 *       - Handling Response sesuai dokumentasi Response dibawah
 *       - Response `invoice_number` untuk formatnya generate bebas
 *      
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               service_code:
 *                 type: string
 *                 example: "PLN"
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
 *                   example: "Transaksi berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     invoice_number:
 *                       type: string
 *                       example: "INV17082023-001"
 *                     service_code:
 *                       type: string
 *                       example: "PLN" 
 *                     service_name:
 *                       type: string
 *                       example: "PLN Prabayar"
 *                     transaction_type:
 *                       type: string
 *                       example: "PAYMENT"
 *                     total_amount:
 *                       type: number
 *                       example: 10000
 *                     created_on:
 *                       type: string
 *                       example: "2023-08-17T10:10:10.000Z"
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
 *                   example: "Service ataus Layanan tidak ditemukan"
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
 *                   example: 108
 *                 message:
 *                   type: string
 *                   example: "Token tidak valid atau kadaluwarsa"
 *                 data:
 *                   type: string
 *                   example: null
 */
router.post('/transaction', validationTransaction, authenticateJWT, createTrx)

/**
 * @openapi
 * /api/v1/transaction/history:
 *   get:
 *     tags:
 *       - 3. Module Transaction
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       **API History Private (memerlukan Token untuk mengaksesnya)**  
 * 
 *       Digunakan untuk mendapatkan informasi history transaksi
 *       
 *       **Ketentuan:**
 *       - Service ini harus menggunakan `Bearer Token JWT` untuk mengaksesnya
 *       - Tidak ada parameter email di query param url ataupun request body, parameter email diambil dari payload JWT yang didapatkan dari hasil login
 *       - Terdapat parameter limit yang bersifat opsional, jika limit tidak dikirim maka tampilkan semua data
 *       - Data di order dari yang paling baru berdasarkan transaction date (created_on)
 *       - Handling Response sesuai dokumentasi Response dibawah
 * 
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           example: 1
 *         required: false
 *         description: Define default value 1.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         required: false
 *         description: Define default value 10. 
 *      
 *     responses:
 *       200:
 *         description: Get History Transaksi berhasil
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
 *                   example: "Get History Berhasil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     limit:
 *                       type: integer
 *                       example: 3
 *                     records:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           invoice_number:
 *                             type: string
 *                             example: "INV17082023-001"
 *                           transaction_type:
 *                             type: string
 *                             example: "PAYMENT"
 *                           description: 
 *                             type: string
 *                             example: "Pembayaran PLN Prabayar"
 *                           total_amount: 
 *                             type: number
 *                             example: 10000
 *                           created_at: 
 *                             type: string
 *                             format: date-time
 *                             example: "2023-08-17T10:10:10.000Z"
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
router.get('/transaction/history', authenticateJWT, getListTrx)


export { router as routes }
