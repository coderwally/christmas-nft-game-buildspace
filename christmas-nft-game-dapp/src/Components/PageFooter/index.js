import twitterLogo from "../../assets/twitter-logo.svg";
import "./PageFooter.css";
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const PageFooter = () => {
  return (
    <>
      <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
      <a
        className="footer-text"
        href={TWITTER_LINK}
        target="_blank"
        rel="noreferrer"
      >{`built with @${TWITTER_HANDLE}`}</a>
    </>
  );
};

export default PageFooter;
