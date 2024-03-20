import "./style.css";

export default function Spinner() {
  return <div className="loading-spinner"></div>;
}

export const Loader = () => {
  return <div className="bar-loader"></div>;
};

export const AppLoader = () => {
  return <div className="app_loader"></div>;
};
