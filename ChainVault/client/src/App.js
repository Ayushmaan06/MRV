import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [networkInfo, setNetworkInfo] = useState(null);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        
        // Check network first
        const network = await provider.getNetwork();
        console.log("Current network:", network);
        
        // Force switch to Hardhat Local if not already
        if (network.chainId !== 1337 && network.chainId !== 31337) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x539' }], // 1337 in hex
            });
          } catch (switchError) {
            if (switchError.code === 4902) {
              // Network not added, add it
              try {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0x539',
                    chainName: 'Hardhat Local',
                    rpcUrls: ['http://127.0.0.1:8545'],
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    }
                  }]
                });
              } catch (addError) {
                console.error('Failed to add network:', addError);
                alert('Please manually switch to Hardhat Local network in MetaMask');
                return;
              }
            } else {
              console.error('Failed to switch network:', switchError);
              alert('Please manually switch to Hardhat Local network in MetaMask');
              return;
            }
          }
        }
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        
        // Get final network info after potential switch
        const finalNetwork = await provider.getNetwork();
        setNetworkInfo(finalNetwork);
        
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        //console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("Metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <div className="App">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="branding">
            <h1 className="app-title">📸 ChainVault</h1>
            <p className="app-subtitle">Secure • Decentralized • Geotagged</p>
          </div>
          
          <div className="connection-status">
            {account ? (
              <div className="wallet-connected">
                <div className="wallet-info">
                  <span className="wallet-address">{account.substring(0, 6)}...{account.substring(38)}</span>
                  <span className={`network-badge ${(networkInfo?.chainId === 1337 || networkInfo?.chainId === 31337) ? 'local' : 'mainnet'}`}>
                    {(networkInfo?.chainId === 1337 || networkInfo?.chainId === 31337) ? '🏠 Local' : '🌐 ' + networkInfo?.name}
                  </span>
                </div>
                <button className="share-btn" onClick={() => setModalOpen(true)}>
                  👥 Share
                </button>
              </div>
            ) : (
              <div className="wallet-disconnected">
                <span>🔗 Connect Wallet</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <FileUpload
          account={account}
          provider={provider}
          contract={contract}
        />
        
        <Display contract={contract} account={account} />
      </main>

      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} />
      )}
    </div>
  );
}

export default App;
