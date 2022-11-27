import "./PageHeader.css";

const PageHeader = ({currentAccount}) => {
  return (
    <div className="header-parts">
      <p className="header gradient-text">🎄 Christmas Joy Spreader 🎄</p>
      <p className="sub-text">Team up to defeat The Grinch!</p>
      <p className="player">Current player: <span className="addy">{currentAccount}</span></p>
    </div>
  );
};

export default PageHeader;
