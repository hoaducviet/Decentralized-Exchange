clean:
	rm -rf cache artifacts ignition/deployments/chain-31337/artifacts ignition/deployments/chain-31337/deployed_addresses.json
	npx hardhat compile
	npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost

deploy:
	npx hardhat run scripts/FactoryToken.js --network localhost
	npx hardhat run scripts/FactoryLiquidityPool.js --network localhost
	npx hardhat run scripts/addLP.js --network localhost
	npx hardhat run scripts/NFTMarket.js --network localhost

	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token
	cp ./pools.json ../frontend/src/assets/pool

rund:
	npx hardhat run scripts/NFTMarket.js --network localhost
	

copy:
	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token
	cp ./pools.json ../frontend/src/assets/pool

