pipeline {
    agent any
    parameters {
        gitParameter branchFilter: 'origin/(.*)', name: 'BRANCH', type: 'PT_BRANCH'
    }
    environment {
        ECR_REPOSITORY_NAME = 'teja-repo'
        ECR_REPOSITORY      = '339713065975.dkr.ecr.us-east-2.amazonaws.com/teja-repo'
        REGION              = 'us-east-2'
        ECS_CLUSTER         = 'hlo-cluster'
        ECS_SERVICE         = 'my-service'
        ACCOUNT_NO          = '339713065975'
        JOB_NAME            = 'ecs-ec2'
        WORKSPACE           = '/var/lib/jenkins/jobs/ecs-ec2-job/workspace'
        ECS_TIMEOUT         = '600'
    }
        stages {
        stage('Clone Git Repo') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "${params.BRANCH}"]],
                        userRemoteConfigs: [[credentialsId: 'git-credentials', url: 'https://github.com/Narravula070/teja-new-repo.git']]
                    ])
                }
            }
        }
        stage('Docker build') {
            steps {
                script {
                    sh '''
                      docker build -t $ACCOUNT_NO.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY_NAME:latest_$BUILD_ID .
                    '''
                }
            }
        }
        stage('ECR Login') {
            steps {
                script {
                    sh '''
                      aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 339713065975.dkr.ecr.us-east-2.amazonaws.com
                    '''
                }
            }
        }
        stage('Docker push') {
            steps {
                script {
                    sh "docker push $ECR_REPOSITORY:latest_$BUILD_ID"
                }
            }
        }
        stage('Remove image from Jenkins server') {
            steps {
                script {
                    sh "docker rmi $ECR_REPOSITORY:latest_$BUILD_ID"
                }
            }
        }
        stage('Update and Get ecs-deploy') {
            steps {
                script {
                    sh  '''#!/bin/bash
                       sed -i 's+latest+latest_'$BUILD_ID'+g' $Task_defination
                       wget https://raw.githubusercontent.com/silinternational/ecs-deploy/master/ecs-deploy
                       chmod u+x ecs-deploy
                    '''
                }
            }
        }
        stage('Deploying image to ECS Cluster') {
            steps {
                script {
                    sh  '''#!/bin/bash
                        ./ecs-deploy -c $ECS_CLUSTER \
                                     -n $ECS_SERVICE \
                                     -r $REGION \
                                     -i $ECR_REPOSITORY:latest_$BUILD_ID \
                                     -t $ECS_TIMEOUT \
                                     --use-latest-task-def
                    '''
                }
            }
        }
    }
    post {
        success {
            script {
                if (params.BRANCH == 'qa') {
                    build job: 'ecs-ec2', parameters: [string(name: 'BRANCH', value: 'main')]
                }
            }
        }
    }
}
