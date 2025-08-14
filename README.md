# IELTS Mock Test Platform - Frontend Application

## 🚀 O'rnatish va Ishga Tushirish

### 1. frontendni ishga tushurish

````bash
npm install

### 2. dependency larni O'rnatish

```bash
npm install

# frontni ishga tushiring
npm run dev
````

Frontend: http://localhost:3000 da ishga tushadi

## 🔧 Texnologiyalar

### Frontend (Next.js)

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Language**: TypeScript
- **UI**: Shadcn/ui

## 📋 Xususiyatlar

### Admin Panel

- ✅ Savol qo'shish (CRUD)
- ✅ Savollarni tahrirlash
- ✅ Savollarni o'chirish
- ✅ Barcha savollarni ko'rish

### Foydalanuvchi

- ✅ Testni boshlash
- ✅ Savollarni javoblash
- ✅ Natijani olish (ball va foiz)
- ✅ Testni qayta topshirish

## 🖥️ Sahifalar

1. **Home** (`/`) - Asosiy sahifa, test boshlash yoki admin panel
2. **Test** (`/test`) - Test sahifasi, savollar va radio buttonlar
3. **Result** (`/result`) - Natija sahifasi, ball va foiz
4. **Admin** (`/admin`) - Admin panel, CRUD operatsiyalar

## 🎯 Foydalanish

1. **Admin sifatida:**

   - `/admin` sahifasiga o'ting
   - "Add New Question" tugmasini bosing
   - Savol matnini kiriting
   - 4 ta javob variantini kiriting
   - To'g'ri javobni belgilang
   - Savolni saqlang

2. **Test topshiruvchi sifatida:**
   - `/test` sahifasiga o'ting
   - Barcha savollarga javob bering
   - "Submit Test" tugmasini bosing
   - Natijangizni `/result` sahifasida ko'ring

## 🔒 Xavfsizlik

- Input validation backend va frontend'da
- SQL injection'dan himoya (TypeORM)
- CORS sozlamalari
- Error handling

## 📱 Responsiv Dizayn

- Mobile-first yondashish
- Tailwind CSS responsive classes
- Barcha qurilmalarda ishlaydi

## 🐛 Debugging

Backend loglar:

```bash
cd backend
npm run start:dev
```

Frontend development server:

```bash
cd frontend
npm run dev
```

## 📈 Kelajakda Qo'shiladigan Xususiyatlar

- [ ] User authentication
- [ ] Test categories
- [ ] Timer functionality
- [ ] Detailed score analysis
- [ ] Export results to PDF
- [ ] Multi-language support
