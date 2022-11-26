import twitterLogo from "../../assets/twitter-logo.svg";
import "./PageFooter.css";
const TWITTER_HANDLE_ME = "traderwally7";
const AUTHOR = "coderwally (a.k.a. @traderwally7)";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE_ME}`;

const PageFooter = () => {
  return (
    <div className="footer-container">
      <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
      <a
        className="footer-link"
        href={TWITTER_LINK}
        target="_blank"
        rel="noreferrer"
      >{`Project for buildspace.so - developer: ${AUTHOR}`}</a>
      <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
    </div>
  );
};

export default PageFooter;
