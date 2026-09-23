# 🏆 SkillWinner - Master Free Fire Esports Tournament Platform
**Version:** 1.0 (Production Ready)  
**App Name:** SkillWinner (`skillwinner`)  
**Parent Brand:** SW Tech Solution (`swgayanbhumi.in`)  

---

## ⚡ Key Highlights & Features Implemented

### 1. 🎯 Match Modes & Mathematical Matrices
1. **Solo Rank + Per Kill Battle (₹20, ₹50, ₹100)**:
   - **₹20 Entry:** ₹5/Kill | 🥇 Rank 1 (Booyah): ₹150 | 🥈 Rank 2: ₹100 | 🥉 Rank 3: ₹50 | 💰 Platform 30% Profit: ₹235
   - **₹50 Entry:** ₹10/Kill | 🥇 Rank 1: ₹450 | 🥈 Rank 2: ₹250 | 🥉 Rank 3: ₹150 | 💰 Platform 30% Profit: ₹588
   - **₹100 Entry:** ₹20/Kill | 🥇 Rank 1: ₹800 | 🥈 Rank 2: ₹450 | 🥉 Rank 3: ₹250 | 💰 Platform 30% Profit: ₹1,176
2. **Option 1: ₹300 Weekly Sunday Gadget Cup (100-120 Players)**:
   - **Prize:** Razer Gaming Headset + ₹5,000 Cash (Total ₹10,000 value) + ₹5,000 Rank 2 + ₹2,500 Rank 3.
   - **Developer Rule:** Min 100 players threshold. Auto-refunds 100% if not met.
   - **Profit:** ~₹5,292 Owner + ₹5,292 Management every Sunday!
3. **Option 2: ₹500 Monthly Mega iPhone Finale (250-300 Players)**:
   - **Prize:** Brand New Apple iPhone 15 (₹65,000) + ₹8,000 Rank 2 + ₹4,000 Rank 3.
   - **Developer Rule:** Min 250 players threshold. Auto-refunds 100% if not met.
   - **Profit:** ~₹18,375 Owner + ₹18,375 Management in a single match!
4. **Clash Squad (4v4 & 2v2)**: Winner Team Takes All (70% net pool return).
5. **Lone Wolf 1v1 Ego Match**: 2 Players (e.g. ₹20 -> ₹28 Winner).

---

### 2. 💳 Dual-Wallet System (The 10% Deduction Rule)
- **Real Wallet:** Cash deposits + Match Winnings (100% usable, 100% withdrawable to UPI).
- **Bonus Wallet:** 50% extra bonus on every deposit (Non-withdrawable).
- **10% Rule:** Max 10% of match entry fee is deducted from Bonus Wallet; remaining 90% is deducted from Real Wallet.

---

### 3. 📲 In-App Direct Instant Payments (No Chrome Redirect)
- Direct UPI Intent (PhonePe, GPay, Paytm, BHIM, CRED).
- Embedded Razorpay standard checkout.
- Instant wallet credit with +50% bonus calculation.

---

### 4. 🔑 Custom Room Reveal & Notification System
- Custom Room ID & Password auto-revealed to joined gamers with 1-click Copy button.
- In-App Notification Center with live unread badge for Room open, prize wins, and deposits.

---

### 5. 🛡️ Admin Controller (`/admin` View)
- Create matches with custom tournament rules and descriptions.
- Publish Room ID & Password to all registered players with 1-click.
- Automated 70/30 Profit & Prize Distributor by entering winner UIDs & kill counts.
- View player phone numbers and manage UPI withdrawal requests.
- 1-Click 100% Auto-Refund engine for cancelled/under-threshold matches.

---

## 🚀 How to Run Locally

```bash
cd skillwinner
npm install
npm run dev
```

App runs on `http://localhost:3001` or embedded inside Next.js.

---

## 📦 How to Build Lightweight APK (<4MB)

```bash
# 1. Build production static assets
npm run build

# 2. Package into ultra-lightweight Android APK using Capacitor:
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init SkillWinner com.swtech.skillwinner --web-dir dist
npx cap add android
npx cap open android
# Build Signed APK in Android Studio (<4MB APK size!)
```
