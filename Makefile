connect:
	ssh -i ~/ssh/exchange.pem ubuntu@47.129.144.60

connect2:
	ssh -i ~/ssh/id_rsa ubuntu@47.129.144.60


transfer:
	scp -i ~/ssh/exchange.pem ~/ssh/id_rsa.pub  ubuntu@47.129.144.60:/home/ubuntu/.ssh
