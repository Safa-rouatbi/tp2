pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')

        BACKEND_IMAGE  = 'tassnime850/smart-code-review-backend:latest'
        FRONTEND_IMAGE = 'tassnime850/smart-code-review-frontend:latest'

        TRIVY_SEVERITY = 'HIGH,CRITICAL'
    }

    stages {


        stage('Checkout') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                sh """
                  docker build -t ${BACKEND_IMAGE} Backend/.
                  docker build -t ${FRONTEND_IMAGE} frontend/.
                """
            }
        }

        stage('Install Trivy') {
            steps {
                sh '''
                  if ! command -v trivy >/dev/null 2>&1; then
                    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh
                    sudo mv ./bin/trivy /usr/local/bin/
                  fi
                '''
            }
        }

        stage('Scan Backend Image') {
            steps {
                sh """
                  trivy image \
                    --severity ${TRIVY_SEVERITY} \
                    --exit-code 1 \
                    --format json \
                    --output trivy-backend.json \
                    ${BACKEND_IMAGE}
                """
            }
        }

 
        stage('Scan Frontend Image') {
            steps {
                sh """
                  trivy image \
                    --severity ${TRIVY_SEVERITY} \
                    --exit-code 1 \
                    --format json \
                    --output trivy-frontend.json \
                    ${FRONTEND_IMAGE}
                """
            }
        }


        stage('Docker Login') {
            steps {
                sh '''
                  echo $DOCKER_HUB_CREDS_PSW | docker login \
                  -u $DOCKER_HUB_CREDS_USR --password-stdin
                '''
            }
        }

        stage('Push Images to Docker Hub') {
            steps {
                sh """
                  docker push ${BACKEND_IMAGE}
                  docker push ${FRONTEND_IMAGE}
                """
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'trivy-*.json', allowEmptyArchive: true
        }
        success {
            echo ' Build, Scan OK, Images pushed to Docker Hub'
        }
        failure {
            echo ' Pipeline failed due to vulnerabilities'
        }
    }
}
