clean:
	rm -rf cache artifacts ignition/deployments/chain-31337/artifacts ignition/deployments/chain-31337/deployed_addresses.json
	npx hardhat compile
	npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost

deploy:
	npx hardhat run scripts/FactoryToken.js --network localhost

	

copy:
	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token

