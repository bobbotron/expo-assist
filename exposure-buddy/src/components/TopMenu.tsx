import { useLocation } from "react-router-dom";

const TopMenu: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <div className="ui borderless menu">
        <div className="ui text container">
          <div className="item">
            <img
              src="/logo.png"
              alt="Exposure tools logo"
              className="ui mini image"
            />
          </div>
          <div className="header item">Exposure Tools</div>
          <a
            className={`item ${
              location.pathname === "/exposure" ? "active" : ""
            }`}
            href="/exposure"
          >
            EV
          </a>
          <a
            className={`item ${location.pathname === "/" ? "active" : ""}`}
            href="/"
          >
            Bellows
          </a>
        </div>
      </div>
    </>
  );
};

export default TopMenu;
