# technoritory-project
Research project for our team technoritory. Deals with Blockchain, android, and NFC/QR code creation.

Installtion manual for web portal
1.Create a new directory and download the source code or clone the app from GitHub . (Link: https://github.com/nishant345/technoritory-project)
2.Open command prompt(CMD) in Windows or terminal in Mac in this directory. (cd directoryName)
3.If you have nodejs installed run command
    npm install
It will download all the depencies for the project. If you don't have nodejs download it from nodejs.org
These depencies require Python. So please download it if you don't have it.
4.Run command truffle migrate or truffle migrate --reset to deploy the contracts to working 
environment. In case of Mac it ask for the system password.
5.Open another CMD/terminal and run npm run dev to run the web server.
6.Download Ganache (https://truffleframework.com/ganache) to run a local Etheereum client on your machine.
7.Install metamask chrome extension(https://metamask.io/) and check if ethereum client (Ganache) works! Working of ethereum client can be verified when you open Ganache and a ring (in the top center)is moving around the RPC server.
8.Open Metamask and configure custom private network (https://localhost:7545). Select Custom RPC on the drop down optiions in metamask. Provide RPC url i.e. HTTP://127.0.0.1:7545 and click save.
9.Get a list accounts from ganache container. There should be three different accounts for three components. You have to manually add these account. For adding an account, go to metamask extension and click on the ball on the left and select import account. Then provide the private key from Ganache client and add it. Every supply chain partner will have its own account.
10.There are three separate portal for three supply chain partners
Manufacturers: http://localhost:3000/views/form.html
Distributor: http://localhost:3000/distributor/views/form.html
Retailer: http://localhost:3000/retailer/views/form.html

Installation for mobile app
1.Download technoritory.apk file from Github. (Link: https://github.com/nishant345/technoritory-project/tree/master/mobile-app)
2.Install it in your mobile phone.
3.Use it.
