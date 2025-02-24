import {
  useLocation,
  useNavigate as originUseNavigate,
} from "react-router-dom";

export function useCustomNavigate() {
  const location = useLocation();
  const navigate = originUseNavigate();

  return (href: string, state?: any) => {
    if (state != null) {
      sessionStorage.setItem(location.pathname, JSON.stringify(state));
    }
    return navigate(href);
  };
}
