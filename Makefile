connect:
	ssh -i ~/ssh/exchange.pem ubuntu@54.179.238.210

connect2:
	ssh -i ~/ssh/id_rsa ubuntu@54.179.238.210


transfer:
	scp -i ~/ssh/exchange.pem ./.env  ubuntu@54.179.238.210:/home/ubuntu/DEX
