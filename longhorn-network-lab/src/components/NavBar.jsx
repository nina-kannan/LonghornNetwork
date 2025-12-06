import { NavLink } from "react-router-dom";

const style = ({ isActive }) => ({
  marginRight: 20,
  color: isActive ? "darkorange" : "black",
  fontWeight: isActive ? 700 : 500,
  textDecoration: "none"
});

export default function NavBar() {
  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
      <NavLink to="/" style={style}>Home</NavLink>
      <NavLink to="/student-graph" style={style}>Student Graph</NavLink>
      <NavLink to="/referral-path" style={style}>Referral Path</NavLink>
      <NavLink to="/chat-history" style={style}>Chat History</NavLink>
    </nav>
  );
}
