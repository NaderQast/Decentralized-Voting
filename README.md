## Getting Started

First
deploy the contract to a new address :

forge create <contract name> --rpc-url <public rpc url> -i --boradcast
then enter your private key

take the new contract address and paste it in a new .env file that you have to create it in the project folder as :

NEXT_PUBLIC_CONTRACT_ADDRESS

go to Reown wagmi cloud website

create a new project and take the projectID paste it in the .env file as :

NEXT_PUBLIC_PROJECT_ID

run the development server:

npm run dev
