clean:
	rm -rf cache artifacts ./ignition/deployments/chain-31337/artifacts ./ignition/deployments/chain-31337/deployed_addresses.json
	npx hardhat compile
	npx hardhat ignition deploy ./ignition/modules/Lock.js
	npx hardhat run ./scripts/FilterNFTsBuild.js

deploy:
	npx hardhat run ./scripts/FactoryToken.js
	npx hardhat run ./scripts/FactoryLiquidityPool.js
	npx hardhat run ./scripts/FactoryNFT.js
	npx hardhat run ./scripts/MarketNFT.js

	npx hardhat run ./scripts/AddLP.js
	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./artifacts/contracts/*/*.json ../backend/src/artifacts

nft1:
	npx hardhat run ./scripts/addnft/HOPE.js
	npx hardhat run ./scripts/addnft/Pirate.js
	npx hardhat run ./scripts/addnft/NyanBalloon.js
	npx hardhat run ./scripts/addnft/Fijis.js
	npx hardhat run ./scripts/addnft/Doodles.js
nft2:
	npx hardhat run ./scripts/addnft/CoolCats.js
	npx hardhat run ./scripts/addnft/BlockQueens.js
	npx hardhat run ./scripts/addnft/BoredApeYachtClub.js
	npx hardhat run ./scripts/addnft/Captainz.js

nft3:
	npx hardhat run ./scripts/addnft/CloneX.js
	npx hardhat run ./scripts/addnft/RumbleKongLeague.js
	npx hardhat run ./scripts/addnft/MutantApeYachtClub.js


nft:
	npx hardhat run ./scripts/addnft/CRYPTOPUNKS.js
	npx hardhat run scripts/BlockNumber.js
	npx hardhat run ./scripts/addnft/Captainz.js


rund:
	npx hardhat run ./scripts/addnft/MutantApeYachtClub.js


copy:
	cp ./artifacts/contracts/*/*.json ../frontend/src/artifacts
	cp ./artifacts/contracts/*/*.json ../backend/src/artifacts


end:
	$(MAKE) clean && \
	$(MAKE) deploy && \
	$(MAKE) nft

start:
	$(MAKE) clean && \
	$(MAKE) deploy && \
	$(MAKE) nft1 && \
	$(MAKE) nft2 && \
	$(MAKE) nft3
