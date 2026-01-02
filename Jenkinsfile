pipeline {
    agent any
    
    environment {
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        
        // Image names
        BACKEND_IMAGE = 'tassnime850/smart-code-review-backend:latest'
        FRONTEND_IMAGE = 'tassnime850/smart-code-review-frontend:latest'
        
        // Trivy severity thresholds
        TRIVY_SEVERITY = 'HIGH,CRITICAL'
        TRIVY_IGNORE_UNFIXED = true
    }
    
    stages {
        // Clean workspace
        stage('Clean') {
            steps {
                cleanWs()
            }
        }
        
        // Checkout code
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        // Build Backend Image
        stage('Build Backend') {
            steps {
                script {
                    echo 'Building Backend Docker image...'
                    docker.build("${BACKEND_IMAGE}", "Backend/.")
                }
            }
        }
        
        // Build Frontend Image
        stage('Build Frontend') {
            steps {
                script {
                    echo 'Building Frontend Docker image...'
                    docker.build("${FRONTEND_IMAGE}", "frontend/.")
                }
            }
        }
        
        // Scan Backend Image with Trivy
        stage('Scan Backend') {
            steps {
                script {
                    echo 'Scanning Backend image with Trivy...'
                    sh """
                    trivy image --severity ${TRIVY_SEVERITY} \
                        --ignore-unfixed ${TRIVY_IGNORE_UNFIXED} \
                        --format json \
                        --output trivy-backend-report.json \
                        ${BACKEND_IMAGE} || true
                    """
                    
                    // Parse and fail if critical vulnerabilities found
                    sh '''
                    if [ -f trivy-backend-report.json ]; then
                        CRITICAL_COUNT=\$(cat trivy-backend-report.json | jq -r '.Results[].Vulnerabilities[] | select(.Severity == "CRITICAL") | .VulnerabilityID' | wc -l)
                        if [ "\$CRITICAL_COUNT" -gt 0 ]; then
                            echo "Found \$CRITICAL_COUNT critical vulnerabilities in backend image"
                            cat trivy-backend-report.json | jq '.Results[].Vulnerabilities[] | select(.Severity == "CRITICAL")'
                            exit 1
                        fi
                    fi
                    '''
                }
            }
        }
        
        // Scan Frontend Image with Trivy
        stage('Scan Frontend') {
            steps {
                script {
                    echo 'Scanning Frontend image with Trivy...'
                    sh """
                    trivy image --severity ${TRIVY_SEVERITY} \
                        --ignore-unfixed ${TRIVY_IGNORE_UNFIXED} \
                        --format json \
                        --output trivy-frontend-report.json \
                        ${FRONTEND_IMAGE} || true
                    """
                    
                    // Parse and fail if critical vulnerabilities found
                    sh '''
                    if [ -f trivy-frontend-report.json ]; then
                        CRITICAL_COUNT=\$(cat trivy-frontend-report.json | jq -r '.Results[].Vulnerabilities[] | select(.Severity == "CRITICAL") | .VulnerabilityID' | wc -l)
                        if [ "\$CRITICAL_COUNT" -gt 0 ]; then
                            echo "Found \$CRITICAL_COUNT critical vulnerabilities in frontend image"
                            cat trivy-frontend-report.json | jq '.Results[].Vulnerabilities[] | select(.Severity == "CRITICAL")'
                            exit 1
                        fi
                    fi
                    '''
                }
            }
        }
        
        // Login to Docker Hub
        stage('Docker Login') {
            steps {
                script {
                    echo 'Logging in to Docker Hub...'
                    sh 'echo $DOCKER_HUB_CREDENTIALS_PSW | docker login -u $DOCKER_HUB_CREDENTIALS_USR --password-stdin'
                }
            }
        }
        
        // Push Backend Image
        stage('Push Backend') {
            steps {
                script {
                    echo 'Pushing Backend image to Docker Hub...'
                    docker.image("${BACKEND_IMAGE}").push()
                }
            }
        }
        
        // Push Frontend Image
        stage('Push Frontend') {
            steps {
                script {
                    echo 'Pushing Frontend image to Docker Hub...'
                    docker.image("${FRONTEND_IMAGE}").push()
                }
            }
        }
        
        // Cleanup
        stage('Cleanup') {
            steps {
                script {
                    echo 'Cleaning up local images...'
                    sh "docker rmi ${BACKEND_IMAGE} ${FRONTEND_IMAGE} || true"
                }
            }
        }
    }
    
    post {
        always {
            // Archive vulnerability reports
            archiveArtifacts artifacts: 'trivy-*.json', allowEmptyArchive: true
            
            // Clean up Docker resources
            sh 'docker system prune -f || true'
        }
        
        failure {
            echo 'Pipeline failed! Check the vulnerability reports and logs.'
        }
        
        success {
            echo 'Pipeline completed successfully! Images pushed to Docker Hub.'
        }
    }
}
