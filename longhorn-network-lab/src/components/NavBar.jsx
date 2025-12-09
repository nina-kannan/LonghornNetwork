import { NavLink } from "react-router-dom";

const style = ({ isActive }) => ({
  marginRight: 20,
  color: isActive ? "#FFA62B" : "#EDE7E3",
  fontWeight: isActive ? 700 : 500,
  textDecoration: "none",
  float: "right"
});

export default function NavBar() {
  return (
    <nav style={{ padding: 16, backgroundColor: "#2F8498" }}>
      <NavLink to="/" 
      style={({ isActive }) => ({
        marginRight: 20,
        color: isActive ? "#FFA62B" : "#EDE7E3",
        fontWeight: 700,
        textDecoration: "none",
      })}>Longhorn Network Lab</NavLink>
      <NavLink to="/chat-history" style={style}>Chat History</NavLink>
      <NavLink to="/referral-path" style={style}>Referral Path</NavLink>
      <NavLink to="/student-graph" style={style}>Student Graph</NavLink>
    </nav>
  );
}
