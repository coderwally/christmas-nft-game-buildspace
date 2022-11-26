import LoadingIndicator from "../LoadingIndicator";
import './Motto.css'

const Motto = ({ isMinting }) => {
  return (
    <div className="motto-container">
      {!isMinting && (
        <h3 className="motto red">
          Mint Your Christmas Hero. Choose wisely and Happy Holidays!
        </h3>
      )}
      {isMinting && (
        <div className="minting orange">
            <LoadingIndicator />
            <h3>Minting In Progress...</h3>
          </div>
      )}
    </div>
  );
};

export default Motto;
