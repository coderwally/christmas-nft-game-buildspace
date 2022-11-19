import "./Card.css";

const Card = ({ name, tokenId, jp, maxJp, imageURI, owner }) => {
  return (
    <div className="nft-card">
      <h2>{name}</h2>
      <h3>NFT #{tokenId}</h3>
      <h4 className="score">
        {jp} / {maxJp}
      </h4>
      <img alt="" src={imageURI} />
      <h4 className="owner-label">OWNER:</h4>
      <h4 className="owner">{owner}</h4>
    </div>
  );
};

export default Card;
