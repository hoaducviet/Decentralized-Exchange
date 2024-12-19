connect:
	ssh -i ~/ssh/exchange.pem ubuntu@3.1.101.226

connect2:
	ssh -i ~/ssh/id_rsa ubuntu@3.1.101.226


transfer:
	scp -i ~/ssh/exchange.pem ~/ssh/id_rsa.pub  ubuntu@3.1.101.226:/home/ubuntu/.ssh
