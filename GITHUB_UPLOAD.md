# GitHub par pura project ek saath kaise bhejein (saari folders)

Website par folder-by-folder upload **mat** karein. Neeche Git use karke **ek hi baar** saari files + folders push karein.

---

## Step 1: Git install karein (agar nahi hai)

1. [git-scm.com/download/win](https://git-scm.com/download/win) se **Windows** wala Git download karein.
2. Install karein (default options theek hain).
3. Install ke baad **PowerShell** ya **Command Prompt** band karke dubara kholen.

---

## Step 2: GitHub par naya repo banao

1. [github.com](https://github.com) → login → **+** → **New repository**.
2. **Repository name** daalein (jaise: `ruqfa-website`).
3. **Create repository** click karein.  
   (README, .gitignore add mat karein — hum apna project push karenge.)

---

## Step 3: Apne project folder me ye commands chalaen

**PowerShell** kholen. Phir ek-ek karke ye type karein (har line ke baad Enter):

```powershell
cd "g:\My Drive\23 - QAIS FILES\App"
```

```powershell
git init
```

```powershell
git add .
```

```powershell
git status
```

(Yahan saari files/folders list honi chahiye — frontend, server, netlify, etc.)

```powershell
git commit -m "Ruqfa website - full project"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/APNA_USERNAME/APNA_REPO_NAME.git
```

**APNA_USERNAME** = tumhara GitHub username  
**APNA_REPO_NAME** = jo repo name diya (jaise `ruqfa-website`)

```powershell
git push -u origin main
```

Agar pehli baar push ho raha hai to GitHub ka **username** aur **password** maangega. Password ki jagah **Personal Access Token** use karna hoga (Settings → Developer settings → Personal access tokens → Generate).

---

## Result

Iske baad GitHub repo me **saari folders** ek saath aa jayengi:

- `frontend/`
- `server/`
- `netlify/`
- `netlify.toml`, `.gitignore`, etc.

**Ye files GitHub par nahi jayengi** (`.gitignore` ki wajah se):  
`website-488003-e84749b32e0a.json`, `.env`, `node_modules/` — ye safe rahengi.

---

## Agar koi error aaye

- **"git is not recognized"** → Git install karein (Step 1), phir terminal band karke naya kholen.
- **"remote origin already exists"** → Pehle: `git remote remove origin` chalaen, phir `git remote add origin ...` dubara.
- **Username/Password fail** → GitHub par Personal Access Token banao aur password ki jagah woh daalein.
