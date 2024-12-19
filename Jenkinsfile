  def timestamp = new Date().format('yyyy-MM-dd')
pipeline {
    agent any  // Sử dụng bất kỳ agent nào có sẵn

    environment {
        DOCKER_IMAGE_FRONTEND = 'viethoaduc/dex_frontend'
        DOCKER_IMAGE_BACKEND = 'viethoaduc/dex_backend'
        DOCKER_IMAGE_CONTRACT = 'viethoaduc/dex_contract'
    }

    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/hoaducviet/Decentralized-Exchange.git'
            }
        }
        stage('Build Image') {
            steps {
                script{
                    dir('backend') {
                        // Chuyển vào thư mục backend và build Docker image
                        script {
                            sh "docker build -t $DOCKER_IMAGE_BACKEND:${timestamp} --platform linux/amd64 ."
                            sh "docker tag $DOCKER_IMAGE_BACKEND:${timestamp} $DOCKER_IMAGE_BACKEND:latest || true"
        
                        }
                    }
                    dir('frontend') {
                        // Chuyển vào thư mục frontend và build Docker image
                        script {
                            sh "docker build -t $DOCKER_IMAGE_FRONTEND:${timestamp} --platform linux/amd64 ."
                            sh "docker tag $DOCKER_IMAGE_FRONTEND:${timestamp} $DOCKER_IMAGE_FRONTEND:latest || true"
                        }
                    }

                    dir('contract') {
                        // Chuyển vào thư mục contract và build Docker image
                        script {
                            sh "docker build -t $DOCKER_IMAGE_CONTRACT:${timestamp} --platform linux/amd64 ."
                            sh "docker tag $DOCKER_IMAGE_CONTRACT:${timestamp} $DOCKER_IMAGE_CONTRACT:latest || true"
                        }
                    }
                }
            }
        }

        stage('Push Image to Register Docker Hub') {
            steps {

                // This step should not normally be used in your script. Consult the inline help for details.
                withDockerRegistry(credentialsId: 'docker-hub', url: 'https://index.docker.io/v1/') {
                    script{
                        sh "docker push $DOCKER_IMAGE_FRONTEND:${timestamp} || true"
                        sh "docker push $DOCKER_IMAGE_BACKEND:${timestamp} || true"
                        sh "docker push $DOCKER_IMAGE_CONTRACT:${timestamp} || true"
                        sh "docker push $DOCKER_IMAGE_FRONTEND:latest"
                        sh "docker push $DOCKER_IMAGE_BACKEND:latest"
                        sh "docker push $DOCKER_IMAGE_CONTRACT:latest"
                    }
                }
            }
        }
        stage('Transfer file to SSH-Server') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: 'remote-server', 
                            transfers: [
                                sshTransfer(
                                    cleanRemote: false, 
                                    remoteDirectory: 'DEX', 
                                    sourceFiles: 'server/docker-compose.yml, server/nginx.conf',
                                    execTimeout: 120000, 
                                    flatten: false, 
                                    makeEmptyDirs: false, 
                                    noDefaultExcludes: false, 
                                    patternSeparator: '[, ]+', 
                                    remoteDirectorySDF: false,
                                    
                                )
                            ], 
                            usePromotionTimestamp: false, 
                            useWorkspaceInPromotion: false, 
                            verbose: false
                        )
                    ]
                )
            }
        }
        stage('Exec Command to SSH-Server') {
            steps {
                sshagent(['ssh_remote']) {
                    sh '''ssh -o StrictHostKeyChecking=no root@52.64.41.231 "
                    cd DEX
                    docker compose down || true
                    docker rmi $(docker images -q)        
                    docker compose up -d
                    "
                    '''
                }
            }
        }
    }
    post {
        always {
            script {
                echo 'Dọn dẹp Docker images...'

                // Xóa Docker image đã tạo ra
                sh 'docker rmi $(docker images -q viethoaduc/dex_frontend) || true'
                sh 'docker rmi $(docker images -q viethoaduc/dex_backend) || true'
                sh 'docker rmi $(docker images -q viethoaduc/dex_contract) || true'

                echo 'Hoàn thành dọn dẹp Docker.'
            }
        }
    }
}