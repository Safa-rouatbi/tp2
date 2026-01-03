pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')

        BACKEND_IMAGE  = 'tassnime850/smart-code-review-backend:latest'
        FRONTEND_IMAGE = 'tassnime850/smart-code-review-frontend:latest'

        TRIVY_SEVERITY = 'HIGH,CRITICAL'
    }

    stages {

        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }

        stage('Checkout Source Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Trivy') {
            steps {
                sh '''
                  if [ ! -f trivy ]; then
                    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
                    mv bin/trivy ./trivy
                  fi
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE} Backend"
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh "docker build -t ${FRONTEND_IMAGE} frontend"
            }
        }

        stage('Scan Backend Image (Trivy - Informative)') {
            steps {
                sh """
                  ./trivy image \
                    --severity ${TRIVY_SEVERITY} \
                    --format json \
                    --output trivy-backend.json \
                    ${BACKEND_IMAGE} || true
                """
            }
        }

        stage('Scan Frontend Image (Trivy - Informative)') {
            steps {
                sh """
                  ./trivy image \
                    --severity ${TRIVY_SEVERITY} \
                    --format json \
                    --output trivy-frontend.json \
                    ${FRONTEND_IMAGE} || true
                """
            }
        }

        stage('Docker Hub Login') {
            steps {
                sh '''
                  echo "$DOCKER_HUB_CREDENTIALS_PSW" | docker login \
                    -u "$DOCKER_HUB_CREDENTIALS_USR" \
                    --password-stdin
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh "docker push ${BACKEND_IMAGE}"
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh "docker push ${FRONTEND_IMAGE}"
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-*.json', allowEmptyArchive: true
        }

        success {
            echo ' Pipeline SUCCESS: build, scan (informative) and push completed.'
        }

        failure {
            echo ' Pipeline FAILED.'
        }
    }
}
