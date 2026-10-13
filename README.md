# 🎱 Loto Mobil

A sleek, mobile-first web application for lottery numbers analysis, sub-arrays triage, and 4-digit reverse combinations discovery (**Selected Reverse**).

---

## 📱 Features

- **Mobile-First & Responsive Design**: Designed with fluid clamp typography, dynamic viewport height (`100dvh`), and iOS/Android notch safe-area support.
- **Three Independent Input Sets**:
  - **Set M**: `M1`, `M2`, `M3`
  - **Set S**: `S1`, `S2`, `S3`
  - **Set J**: `J1`, `J2`
- **Smart Touch Input**: Automatic numeric keypad popup, 2-digit auto-advance, and keyboard dismissal on calculation.
- **Triage Action**: Searches the internal dataset and renders matching sub-arrays and their reverse numbers in an integrated card format.
- **Selected Reverse Engine**: Cross-compares numbers between separate input boxes and extracts matching 4-digit combinations (e.g., `0880`, `4224`).

---

## 🚀 How to Deploy to GitHub Pages

1. **Initialize Git (if not already done)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Loto Mobil"
   ```

2. **Push to your GitHub repository**:
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   1. On GitHub, go to your repository's **Settings** tab.
   2. In the left sidebar, click on **Pages**.
   3. Under **Build and deployment**:
      - **Source**: Select `Deploy from a branch`.
      - **Branch**: Choose `main` branch and `/ (root)` folder.
   4. Click **Save**.
   5. Within 1–2 minutes, your website will be live at:
      ```
      https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/
      ```

---

## 🛠️ Tech Stack

- **HTML5**: Semantic tags, accessibility (`aria-live`, `aria-label`), mobile viewport configuration.
- **CSS3**: Glassmorphism, CSS Grid, Flexbox, CSS Clamp (`clamp()`), safe-area insets.
- **Vanilla JavaScript**: Zero dependencies, fully client-side execution.
