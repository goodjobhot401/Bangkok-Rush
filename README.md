# ✈️ 曼谷 Travelodge Sukhumvit 11 周邊全攻略 (12/18 - 12/20)

這是一個專為 **12/18 – 12/20 曼谷自由行** 打造的純靜態旅遊資訊網站，以 **Travelodge Sukhumvit 11（Superior Premium Room 雙人房）** 為中心，透過 Tab 分頁整合周邊步行 15～20 分鐘與車程 20 分鐘內的精選景點、實景圖輯、官方網站與 Google Maps 導航。

## 🏨 住宿核心資訊
* **入住飯店**：Travelodge Sukhumvit 11
* **入住房型**：Superior Premium Room（高級尊貴雙人房）
* **住宿日期**：12/18 (五) – 12/20 (日)（共 2 晚，雙人房）
* **交通設定**：步行（15～20 分鐘內）或搭乘 Grab / 計程車 / 嘟嘟車（車程 20 分鐘內）

## 🗂️ 網站分頁架構 (Tabs)
1. **🏨 住宿與房型 (`Travelodge Sukhumvit 11`)**：Superior Premium Room 互動式 6 張實景畫廊、入住/退房憑證卡、房型設備規格、頂樓泳池與免費嘟嘟車接駁資訊。
2. **💆‍♀️ 頂級 SPA 按摩 (9 間)**：包含步行 3 分鐘即達的 `divana nurture spa`、`Let's Relax Spa` 四大分店、`Health Land Asoke`、`Oasis Spa`、`BHAWA SPA` 與 `Yunomori Onsen` 日式溫泉（附 `Urban Retreat` 歇業提醒）。
3. **🍽️ 米其林必比登美食 (8 間)**：包含米其林一星 `KHAO (Ekkamai)`、必比登 `榮泰豬肉米粉湯`、`Here Hai 瘋狂蟹肉炒飯`、`紅大哥水門雞飯`、`Polo Fried Chicken`、`Baan Ice` 與米其林入選 `Sri Trat`、`Supanniga Eating Room`（附 `Jeh O Chula` 暫停營業提醒）。
4. **🌿 中文友善大麻店 (5 間)**：包含正宗台灣人經營複合式餐麻館 `GOLDEN HOUR BKK`、飯店步行 2 分鐘 `KANA PURE`、`MedMen`、`Thai Cannabis Club` 與 `Siam Green`（附 `Pakalolo` 永久歇業避雷提醒）。
5. **🧭 延伸備案全集 (12 間)**：周邊其他大麻店、特色視障/精緻按摩館（`URI Spa`、`Perception Blind Massage`）與人氣泰菜（`Phed Mark` 打拋豬、`Taling Pling`、凌晨 4 點宵夜泰菜）。
6. **❤️ 我的收藏**：支援點擊「♡ 收藏」將心儀店家儲存在瀏覽器 `localStorage`，並提供「一鍵複製店名叫 Grab」功能。

## 🚀 本地開發與 GitHub Pages 部署

```bash
# 安裝依賴
npm install

# 啟動本地開發伺服器
npm run dev

# 打包靜態網站 (輸出至 dist/)
npm run build
```

推送至 GitHub `main` 分支後，`.github/workflows/deploy.yml` 將自動打包並部署至 GitHub Pages（無需任何後端或 Supabase 設定）。
