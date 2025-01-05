connect:
	ssh -i ~/ssh/exchange.pem ubuntu@18.140.114.244

connect2:
	ssh -i ~/ssh/id_rsa ubuntu@18.140.114.244


transfer:
	scp -i ~/ssh/exchange.pem -r ./server/*  ubuntu@18.140.114.244:/home/ubuntu/DEX
