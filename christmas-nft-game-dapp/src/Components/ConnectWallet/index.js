import "./ConnectWallet.css";

const ConnectWallet = ({ setCurrentAccount }) => {
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="connect-wallet-container">
      <img
        src="https://media.giphy.com/media/Gpi6b9M5Sz62RM6uLZ/giphy.gif"
        alt="Christmas Dog Gif"
      />
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWalletAction}
      >
        Connect Wallet To Get Started
      </button>
    </div>
  );
};

export default ConnectWallet;
