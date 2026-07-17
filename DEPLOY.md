# Deploy Mikhtav (Azure DevOps + Vercel)

Public architecture:

- **API** — Azure App Service (.NET 8), deployed by Azure DevOps
- **Database** — Azure SQL
- **Frontend** — Vercel (`src/web`), auto-deploy from GitHub

```
Users → Vercel (frontend) → App Service (API) → Azure SQL
```

---

## Prerequisites

- Azure subscription
- Azure DevOps project
- GitHub repo pushed to `main` (`sofia-muse/mikhtav`)
- Vercel account
- .NET 8 SDK locally (for one-time database migration)

---

## 1. Create Azure resources

### 1.1 Resource group

Portal → **Resource groups** → **Create**

| Field | Value |
|-------|--------|
| Name | `mikhtav-prod-rg` |
| Region | e.g. West Europe (use the same region for SQL and App Service) |

### 1.2 Azure SQL Database

Portal → **SQL databases** → **Create**

**Basics**

| Field | Value (change from default if needed) |
|-------|--------------------------------------|
| Resource group | `mikhtav-prod-rg` |
| Database name | `Mikhtav` |
| Server | Create new — globally unique name, e.g. `mikhtav-sql-12345` |
| Authentication | **Use SQL authentication** |
| Admin login / password | Save securely |

**Compute + storage**

| Tier | When |
|------|------|
| **Basic** | Demo / low traffic |
| **Standard S0** | Small production |

**Networking**

| Setting | Value |
|---------|--------|
| Connectivity | Public endpoint |
| Allow Azure services and resources to access this server | **Yes** |
| Add current client IP address | **Yes** (needed for local `dotnet ef database update`) |

Skip Microsoft Defender and geo-redundancy for v1 unless you need them.

After create: open the database → **Connection strings** → copy **ADO.NET**. Replace `{your_password}` with your admin password.

Example:

```text
Server=tcp:mikhtav-sql-12345.database.windows.net,1433;Initial Catalog=Mikhtav;User ID=mikhtavadmin;Password=YOUR_PASSWORD;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### 1.3 Azure App Service

Portal → **App Services** → **Create** → **Web App**

| Field | Value (change from default if needed) |
|-------|--------------------------------------|
| Resource group | `mikhtav-prod-rg` |
| Name | e.g. `mikhtav-api` → `https://mikhtav-api.azurewebsites.net` |
| Publish | **Code** |
| Runtime stack | **.NET 8 (LTS)** |
| Operating System | Linux (cheaper) or Windows |
| Region | Same as SQL |
| App Service Plan | **Basic B1** minimum (Free tier sleeps) |

After create:

**Configuration** → **Application settings** → add:

| Name | Value |
|------|--------|
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ConnectionStrings__Default` | Azure SQL ADO.NET connection string |

**Configuration** → **General settings**:

| Setting | Value |
|---------|--------|
| HTTPS only | On |
| Always On | On (requires Basic+) |

CORS origins are added in step 4 after Vercel deploy.

---

## 2. Run database migrations (one-time)

From your machine (SQL firewall must allow your IP):

```powershell
cd C:\Users\Admin\source\repos\mikhtav
$env:ConnectionStrings__Default="Server=tcp:....;Initial Catalog=Mikhtav;User ID=...;Password=...;Encrypt=True;TrustServerCertificate=False;"
dotnet tool restore
dotnet ef database update --project src/Mikhtav.Infrastructure --startup-project src/Mikhtav.Api
```

Migrations include seeded letter content via `HasData` — no separate seed step.

Verify in Azure Portal (Query editor) or after API deploy:

`https://<webAppName>.azurewebsites.net/api/letters?lang=en`

---

## 3. Azure DevOps pipeline

### 3.1 Connect GitHub

Azure DevOps → **Project settings** → **GitHub connections** → authorize `sofia-muse/mikhtav`.

### 3.2 Service connection

**Project settings** → **Service connections** → **New** → **Azure Resource Manager**

- Authentication: workload identity or service principal (follow portal wizard)
- Subscription: the one containing `mikhtav-prod-rg`
- Name: e.g. `mikhtav-azure-prod`

### 3.3 Create pipeline

**Pipelines** → **New pipeline** → **GitHub** → select repo → **Existing Azure Pipelines YAML file** → branch `main`, path `/azure-pipelines.yml`.

### 3.4 Pipeline variables

**Pipelines** → your pipeline → **Edit** → **Variables**:

| Name | Value | Secret |
|------|--------|--------|
| `azureServiceConnection` | `mikhtav-azure-prod` (exact service connection name) | No |
| `webAppName` | e.g. `mikhtav-api` | No |
| `webAppType` | `webAppLinux` or `webApp` (Windows) | No |

### 3.5 Environment approval (optional)

First run may prompt to create **production** environment and authorize the service connection. Approve when prompted.

### 3.6 Run pipeline

Push to `main` or **Run pipeline** manually. On success, API is live at `https://<webAppName>.azurewebsites.net/swagger`.

---

## 4. Vercel frontend

1. [vercel.com](https://vercel.com) → **Add New Project** → import `sofia-muse/mikhtav`
2. **Root Directory**: `src/web` (not repo root)
3. **Framework**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Environment variables** (Production):

| Name | Value |
|------|--------|
| `VITE_API_URL` | `https://<webAppName>.azurewebsites.net` (no trailing slash) |

7. Deploy. Note the URL, e.g. `https://mikhtav.vercel.app`.

### 4.1 Enable CORS on API

App Service → **Configuration** → add:

| Name | Value |
|------|--------|
| `Cors__AllowedOrigins__0` | `https://<your-vercel-domain>` |
| `Cors__AllowedOrigins__1` | `http://localhost:5173` (optional, local dev against prod API) |

Save and **restart** the App Service.

Custom domain on Vercel: add that HTTPS origin to CORS as well.

---

## 5. Verification checklist

| Check | Expected |
|-------|----------|
| `GET https://<api>.azurewebsites.net/api/letters?lang=en` | JSON with categories |
| `https://<api>.azurewebsites.net/swagger` | Swagger UI loads |
| `https://<vercel-app>/` | Home page with letters |
| Letter detail page | Sections and guidance render |
| Glossary | Terms load |
| Language switch (EN/HE/RU/UK) | Content updates |
| Browser console | No CORS errors |

---

## 6. Local development (unchanged)

```powershell
dotnet run --project src/Mikhtav.Api
cd src/web && npm run dev
```

- API: `http://localhost:5080`
- Frontend: `http://localhost:5173`
- CORS allows `http://localhost:5173` via `appsettings.json`

---

## 7. Troubleshooting

| Symptom | Likely cause |
|---------|----------------|
| API 500 on first request | Migrations not applied; wrong connection string |
| CORS error in browser | Missing `Cors__AllowedOrigins__0` or App Service not restarted |
| Frontend shows error / empty | Wrong `VITE_API_URL`; redeploy Vercel after fixing |
| Pipeline deploy fails | Wrong `webAppType` (Linux vs Windows) or service connection scope |
| `dotnet ef database update` fails | Your IP not in SQL firewall rules |

---

## 8. Secrets

Do **not** commit production connection strings or passwords. Use:

- App Service **Application settings** for API secrets
- Vercel **Environment variables** for `VITE_API_URL`
