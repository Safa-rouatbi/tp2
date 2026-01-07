# 🚀 Smart Code Review - Projet DevOps Complet

## 📋 Vue d'ensemble

Application full-stack de revue de code intelligente avec **monitoring et observabilité complets**.

### 🛠️ Stack Technique

- **Backend**: Node.js + Express + MongoDB
- **Frontend**: React/Vue + Nginx
- **Conteneurisation**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins
- **Monitoring**: Prometheus + Grafana ⭐ **NOUVEAU**

---

## 🎯 Fonctionnalités DevOps

✅ **Application complète** avec authentification et gestion de projets  
✅ **Dockerisation** des services  
✅ **Docker Compose** pour environnement de développement  
✅ **Déploiements Kubernetes** avec ConfigMaps et Services  
✅ **Helm Chart** pour le backend  
✅ **Pipeline Jenkins** pour CI/CD  
✅ **Prometheus** pour la collecte de métriques ⭐  
✅ **Grafana** pour la visualisation et les dashboards ⭐  

---

## 📊 Monitoring et Observabilité

Le projet intègre un système complet de monitoring:

- **Prometheus** collecte les métriques toutes les 15 secondes
- **Grafana** visualise les données avec des dashboards interactifs
- **Métriques HTTP**: Nombre de requêtes, temps de réponse, taux d'erreur
- **Métriques Système**: CPU, mémoire, heap Node.js

### Accès rapide:
- 📊 Prometheus: http://localhost:9090 (Docker) / http://localhost:30090 (K8s)
- 📈 Grafana: http://localhost:3001 (Docker) / http://localhost:30300 (K8s)
  - Login: `admin` / `admin123`

**📖 Guide complet:** [MONITORING_README.md](MONITORING_README.md)  
**⚡ Démarrage rapide:** [QUICKSTART_MONITORING.md](QUICKSTART_MONITORING.md)

---

## 🚀 Démarrage Rapide

### Option 1: Docker Compose (Recommandé pour débuter)

```powershell
# 1. Installer les dépendances
cd Backend
npm install
cd ..

# 2. Démarrer tous les services
docker-compose up -d

# 3. Vérifier
docker-compose ps
```

**Accès:**
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001

### Option 2: Kubernetes

```powershell
# Déployer l'application
kubectl apply -f Backend/mongo-deployment.yaml
kubectl apply -f Backend/mongo-service.yaml
kubectl apply -f Backend/backend-configmap.yaml
kubectl apply -f Backend/backend-deployment.yaml
kubectl apply -f frontend/frontend-deployment.yaml
kubectl apply -f frontend/frontend-service.yaml

# Déployer le monitoring
.\deploy-monitoring.ps1
```

---

## 📁 Structure du Projet

```
examenDevops/
├── Backend/                      # Application Node.js
│   ├── server.js                 # Point d'entrée (avec /metrics)
│   ├── middlewares/
│   │   └── metricsMiddleware.js  # Collecte Prometheus
│   ├── controllers/              # Logique métier
│   ├── models/                   # Schémas MongoDB
│   ├── routes/                   # Endpoints API
│   └── backend-chart/            # Helm Chart
│
├── frontend/                     # Application web
│   └── src/                      # Code source
│
├── monitoring/                   # Configuration Monitoring ⭐
│   ├── prometheus-*.yaml         # Déploiement Prometheus K8s
│   ├── grafana-*.yaml            # Déploiement Grafana K8s
│   ├── prometheus-local.yml     # Config Docker Compose
│   └── grafana-dashboard-backend.json  # Dashboard pré-configuré
│
├── docker-compose.yml            # Orchestration locale (avec monitoring)
├── Jenkinsfile                   # Pipeline CI/CD
│
└── Documentation/
    ├── MONITORING_README.md      # Guide monitoring complet
    ├── QUICKSTART_MONITORING.md  # Démarrage rapide
    ├── PRESENTATION_TECHNIQUE.md # Support de présentation
    └── CHANGEMENTS_MONITORING.md # Résumé des modifications
```

---

## 🧪 Tester le Monitoring

```powershell
# Générer du trafic de test
.\test-monitoring.ps1

# Vérifier les métriques
curl http://localhost:5000/metrics
```

---

## 📚 Documentation

- **Guide Complet Monitoring**: [MONITORING_README.md](MONITORING_README.md)
- **Démarrage Rapide**: [QUICKSTART_MONITORING.md](QUICKSTART_MONITORING.md)
- **Présentation Technique**: [PRESENTATION_TECHNIQUE.md](PRESENTATION_TECHNIQUE.md)
- **Jenkins CI/CD**: [JENKINS_README.md](JENKINS_README.md)

---

## 🛠️ Commandes Utiles

### Docker Compose

```powershell
# Démarrer
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter
docker-compose down

# Rebuild
docker-compose up -d --build
```

### Kubernetes

```powershell
# Voir les pods
kubectl get pods
kubectl get pods -n monitoring

# Voir les services
kubectl get svc
kubectl get svc -n monitoring

# Logs
kubectl logs -f <pod-name>
```

---

## 📊 Métriques Disponibles

### Métriques HTTP
- `http_requests_total` - Nombre total de requêtes
- `http_request_duration_seconds` - Durée des requêtes
- `http_requests_active` - Requêtes en cours

### Métriques Système
- `process_cpu_seconds_total` - Utilisation CPU
- `process_resident_memory_bytes` - Mémoire RAM
- `nodejs_heap_size_used_bytes` - Heap utilisé

**Labels**: method, route, status_code

---

## 🎨 Dashboard Grafana

Le projet inclut un dashboard pré-configuré avec 8 graphiques:

1. Requêtes HTTP par seconde
2. Requêtes actives
3. Durée des requêtes (95e percentile)
4. Utilisation mémoire
5. Requêtes par méthode HTTP
6. Taux d'erreur (5xx)
7. Utilisation CPU
8. Top 5 routes par volume

**Import**: `monitoring/grafana-dashboard-backend.json`

---

## 🔧 Configuration

### Variables d'environnement (Backend)

```env
PORT=5000
MONGODB_URI=mongodb://mongo:27017/smart-code-review
JWT_SECRET=your-secret-key
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
VERTEX_PROJECT=your-project-id
VERTEX_LOCATION=us-central1
```

### Ports

| Service | Docker Compose | Kubernetes |
|---------|---------------|------------|
| Backend | 5000 | 5000 |
| Frontend | 3000 | 80 |
| MongoDB | 27017 | 27017 |
| Prometheus | 9090 | 30090 |
| Grafana | 3001 | 30300 |

---

## 🎯 Fonctionnalités de l'Application

- 🔐 Authentification JWT
- 📁 Gestion de projets
- 📝 Soumissions de code
- 🤖 Revue de code avec AI
- 💬 Système de commentaires
- 👥 Profils utilisateurs

---

## 🚀 Pipeline CI/CD

Le Jenkinsfile automatise:

1. Checkout du code
2. Build des images Docker
3. Tests
4. Push vers le registry
5. Déploiement Kubernetes
6. Déploiement du monitoring

---

## 📈 Évolutions Futures

- [ ] Alertmanager pour notifications
- [ ] Loki pour logs centralisés
- [ ] Jaeger pour distributed tracing
- [ ] Node Exporter pour métriques infrastructure
- [ ] Service Mesh (Istio)

---

## 👥 Contribution

Ce projet est un exemple académique de DevOps complet.

---

## 📝 Licence

Projet éducatif - DevOps 2026

---

## 🎉 Projet Complet!

✅ Application fonctionnelle  
✅ Conteneurisation complète  
✅ Orchestration Kubernetes  
✅ CI/CD avec Jenkins  
✅ **Monitoring avec Prometheus**  
✅ **Observabilité avec Grafana**  
✅ Documentation exhaustive  

**Prêt pour la production! 🚀**
