clean:
	rm -rf cache artifacts ignition/deployments/chain-31337/artifacts ignition/deployments/chain-31337/deployed_addresses.json
	npx hardhat compile
	npx hardhat ignition deploy ./ignition/modules/Lock.js --network localhost

deploy:
	npx hardhat run scripts/FactoryToken.js --network localhost
	npx hardhat run scripts/FactoryLiquidityPool.js --network localhost
	npx hardhat run scripts/AddLP.js --network localhost
	npx hardhat run scripts/NFTMarket.js --network localhost
	npx hardhat run scripts/AddCollections.js --network localhost

	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token
	cp ./pools.json ../frontend/src/assets/pool



rund:

nft:
	npx hardhat run scripts/addnft/BlockQueens.js --network localhost
	npx hardhat run scripts/addnft/Pirate.js --network localhost
	npx hardhat run scripts/addnft/BoredApeYachtClub.js --network localhost
	npx hardhat run scripts/addnft/CoolCats.js --network localhost
	npx hardhat run scripts/addnft/Doodles.js --network localhost
	npx hardhat run scripts/addnft/NyanBalloon.js --network localhost
	npx hardhat run scripts/addnft/Fijis.js --network localhost 
	npx hardhat run scripts/addnft/HOPE.js --network localhost
	
	npx hardhat run scripts/addnft/CloneX.js --network localhost
	npx hardhat run scripts/addnft/MutantApeYachtClub.js --network localhost
	npx hardhat run scripts/addnft/RumbleKongLeague.js --network localhost
	npx hardhat run scripts/addnft/CRYPTOPUNKS.js --network localhost
	npx hardhat run scripts/addnft/Captainz.js --network localhost

copy:
	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token
	cp ./pools.json ../frontend/src/assets/pool

