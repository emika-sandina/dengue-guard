## DengueGuard Helm chart

This chart deploys the DengueGuard **frontend** (nginx) and **backend** (node/express).

### Render / validate locally

From `Dengue-Guard/`:

```bash
helm template dengueguard ./helm
```

### Install

```bash
helm upgrade --install dengueguard ./helm \
  --set frontend.config.supabaseUrl="https://YOUR.supabase.co" \
  --set frontend.config.supabaseAnonKey="YOUR_PUBLIC_ANON_KEY" \
  --set frontend.config.apiUrl="http://dengueguard-backend:5000"
```

### Backend Supabase env

The backend Deployment can source:

- `SUPABASE_URL` from a ConfigMap
- `SUPABASE_ANON_KEY` from a Secret (recommended)

Create them via the chart:

```bash
helm upgrade --install dengueguard ./helm \
  --set supabase.createConfigMap=true \
  --set supabase.url="https://YOUR.supabase.co" \
  --set supabase.createSecret=true \
  --set supabase.anonKey="YOUR_PUBLIC_ANON_KEY"
```

Or reference existing resources:

```bash
helm upgrade --install dengueguard ./helm \
  --set supabase.existingConfigMapName="supabase-config" \
  --set supabase.existingSecretName="supabase-secret"
```

### Ingress (optional)

Routes:

- `/` -> frontend
- `/api` and `/chatbot` -> backend

```bash
helm upgrade --install dengueguard ./helm \
  --set ingress.enabled=true \
  --set ingress.className="nginx" \
  --set ingress.host="dengueguard.example.com"
```

