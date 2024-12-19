connect:
	ssh -i ~/ssh/exchange.pem ubuntu@18.142.238.97

connect2:
	ssh -i ~/ssh/id_rsa ubuntu@18.142.238.97


transfer:
	scp -i ~/ssh/exchange.pem ~/ssh/id_rsa.pub  ubuntu@18.142.238.97:/home/ubuntu/.ssh
