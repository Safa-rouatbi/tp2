# Jenkins Pipeline Configuration

This project includes a Jenkins pipeline for CI/CD automation.

## Prerequisites

1. **Jenkins** (v2.0+)
2. **Docker** installed on Jenkins agent
3. **Trivy** installed on Jenkins agent for vulnerability scanning
4. **Docker Hub account** for image publishing

## Required Jenkins Plugins

- Docker Pipeline
- Pipeline
- Docker Plugin
- HTML Publisher Plugin (for Trivy reports)

## Required Tools on Jenkins Agent

```bash
# Install Trivy
wget https://github.com/aquasecurity/trivy/releases/download/v0.50.4/trivy_0.50.4_Linux-64bit.deb
dpkg -i trivy_0.50.4_Linux-64bit.deb

# Verify installation
trivy --version
```

## Jenkins Configuration

### 1. Create Docker Hub Credentials

1. Go to **Jenkins Dashboard** → **Manage Jenkins** → **Credentials**
2. Add a new credential:
   - Kind: **Username and password**
   - ID: `docker-hub-credentials`
   - Username: Your Docker Hub username
   - Password: Your Docker Hub password or access token

### 2. Create Multibranch Pipeline

1. Go to **Jenkins Dashboard** → **New Item**
2. Select **Multibranch Pipeline**
3. Name: `smart-code-review-platform`
4. In **Branch Sources**, add:
   - GitHub (or your Git provider)
   - Repository URL
   - Credentials (if private repository)
5. In **Build Configuration**, set:
   - Mode: by Jenkinsfile
   - Script Path: `Jenkinsfile`

## Pipeline Stages

| Stage | Description |
|-------|-------------|
| Clean | Clean workspace |
| Checkout | Clone repository |
| Build Backend | Build Docker image for backend |
| Build Frontend | Build Docker image for frontend |
| Scan Backend | Scan backend image with Trivy |
| Scan Frontend | Scan frontend image with Trivy |
| Docker Login | Authenticate to Docker Hub |
| Push Backend | Push backend image to Docker Hub |
| Push Frontend | Push frontend image to Docker Hub |
| Cleanup | Remove local images |

## Vulnerability Scanning

The pipeline uses [Trivy](https://github.com/aquasecurity/trivy) to scan Docker images for vulnerabilities.

### Configuration

```groovy
TRIVY_SEVERITY = 'HIGH,CRITICAL'  // Vulnerability severity levels to detect
TRIVY_IGNORE_UNFIXED = true       // Ignore vulnerabilities without fixes
```

### Severity Levels

- CRITICAL: Immediate threat, must be fixed
- HIGH: Significant vulnerability
- MEDIUM: Moderate risk
- LOW: Minor risk
- UNKNOWN: Unknown severity

### Failing the Build

The pipeline fails if any CRITICAL vulnerabilities are found. HIGH severity vulnerabilities will be reported but won't fail the build (configurable).

## Environment Variables

Configure these in the pipeline or Jenkins global configuration:

| Variable | Description |
|----------|-------------|
| `DOCKER_HUB_CREDENTIALS` | Jenkins credential ID for Docker Hub |
| `BACKEND_IMAGE` | Backend image name (e.g., `user/backend:latest`) |
| `FRONTEND_IMAGE` | Frontend image name (e.g., `user/frontend:latest`) |
| `TRIVY_SEVERITY` | Comma-separated severity levels |
| `TRIVY_IGNORE_UNFIXED` | Ignore unfixed vulnerabilities (true/false) |

## Docker Hub Image Names

Update the `Jenkinsfile` with your Docker Hub username:

```groovy
BACKEND_IMAGE = 'yourusername/smart-code-review-backend:latest'
FRONTEND_IMAGE = 'yourusername/smart-code-review-frontend:latest'
```

## Viewing Reports

Trivy vulnerability reports are archived as build artifacts:

1. Navigate to a build
2. Click **HTML Report** (if using HTML Publisher)
3. Or download `trivy-backend-report.json` and `trivy-frontend-report.json`

## Troubleshooting

### Trivy not found

Ensure Trivy is installed on the Jenkins agent:
```bash
which trivy
trivy --version
```

### Docker login failed

Check Docker Hub credentials in Jenkins:
- Verify credential ID matches `Jenkinsfile`
- Token may be required instead of password

### Build fails on vulnerability scan

- Review the Trivy report
- Update base images to patched versions
- Consider adding specific ignore rules for known issues
