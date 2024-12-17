connect:
	ssh -i ~/ssh/exchange.pem ubuntu@52.64.41.231

jenkin:
	ssh -i ~/ssh/Jenkin-singapore.pem ubuntu@47.129.219.201

transfer:
	scp -i ~/ssh/Jenkin-singapore.pem ~/ssh/docker-compose.yml  ubuntu@47.129.219.201:/home/ubuntu/jenkin
