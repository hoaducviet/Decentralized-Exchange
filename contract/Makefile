clean:
	rm -rf cache artifacts ignition/deployments/chain-31337/artifacts ignition/deployments/chain-31337/deployed_addresses.json
	npx hardhat compile
	npx hardhat ignition deploy ./ignition/modules/Lock.js

deploy:
	npx hardhat run scripts/FactoryToken.js
	npx hardhat run scripts/FactoryLiquidityPool.js
	npx hardhat run scripts/AddLP.js
	npx hardhat run scripts/NFTMarket.js
	npx hardhat run scripts/AddCollections.js

	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token
	cp ./pools.json ../frontend/src/assets/pool



rund:
	npx hardhat run scripts/BlockNumber.js

nft:
	npx hardhat run scripts/addnft/BlockQueens.js
	npx hardhat run scripts/addnft/Pirate.js
	npx hardhat run scripts/addnft/BoredApeYachtClub.js
	npx hardhat run scripts/addnft/CoolCats.js
	npx hardhat run scripts/addnft/Doodles.js
	npx hardhat run scripts/addnft/NyanBalloon.js
	npx hardhat run scripts/addnft/Fijis.js 
	npx hardhat run scripts/addnft/HOPE.js
	
	npx hardhat run scripts/addnft/CloneX.js
	npx hardhat run scripts/addnft/MutantApeYachtClub.js
	npx hardhat run scripts/addnft/RumbleKongLeague.js
	npx hardhat run scripts/addnft/CRYPTOPUNKS.js
	npx hardhat run scripts/addnft/Captainz.js

copy:
	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./tokens.json ../frontend/src/assets/token
	cp ./pools.json ../frontend/src/assets/pool

