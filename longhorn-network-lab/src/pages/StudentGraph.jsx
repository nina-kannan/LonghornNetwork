import { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

const API_BASE = 'http://localhost:8080/api';

export default function StudentGraph() {
  const [selectedCase, setSelectedCase] = useState("1");
  const [showRoommates, setShowRoommates] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [roommateLinks, setRoommateLinks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load test case from backend
  const loadTestCase = async (caseNumber) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/load-testcase/${caseNumber}`, {
        method: 'POST'
      });
      await fetchGraphData();
      await fetchRoommates();
    } catch (error) {
      console.error('Error loading test case:', error);
    }
    setLoading(false);
  };

  // Fetch graph data from backend
  const fetchGraphData = async () => {
    try {
      const response = await fetch(`${API_BASE}/graph`);
      const data = await response.json();
      setGraphData(data);
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  // Fetch roommate pairs from backend
  const fetchRoommates = async () => {
    try {
      const response = await fetch(`${API_BASE}/roommates`);
      const data = await response.json();
      setRoommateLinks(data.roommateLinks || []);
    } catch (error) {
      console.error('Error fetching roommates:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    loadTestCase(1);
  }, []);

  // Combine original + roommate links when toggle is ON
  const combinedLinks = showRoommates
    ? [...graphData.links, ...roommateLinks.map(l => ({ ...l, isRoommate: true }))]
    : graphData.links;

  const displayData = { nodes: graphData.nodes, links: combinedLinks };

  // Assign colors to roommate pairs
  const colors = ["orange", "green", "purple", "red", "yellow", "cyan"];
  const nodeColorMap = {};

  roommateLinks.forEach((link, idx) => {
    const color = colors[idx % colors.length];
    nodeColorMap[link.source] = color;
    nodeColorMap[link.target] = color;
  });

  const nodeColor = (node) =>
    showRoommates && nodeColorMap[node.id] ? nodeColorMap[node.id] : "lightblue";

  const nodeVal = 6;

  const linkColor = (link) => {
    if (link.isRoommate && showRoommates) {
      return nodeColorMap[link.source.id || link.source] || "gray";
    }
    return "black";
  };

  const linkWidth = (link) => (link.isRoommate ? 2 : 2);

  const linkLabel = (link) =>
    !link.isRoommate && link.weight ? `${link.weight}` : "";

  return (
    <div>
      <h1>Student Graph</h1>

      <select
        value={selectedCase}
        onChange={(e) => {
          setSelectedCase(e.target.value);
          loadTestCase(parseInt(e.target.value));
        }}
        style={{ padding: '8px', minWidth: '200px', marginRight: '20px' }}
        disabled={loading}
      >
        <option value="1">Test Case 1</option>
        <option value="2">Test Case 2</option>
        <option value="3">Test Case 3</option>
      </select>

      <button
        onClick={() => {
          fetch(`${API_BASE}/assign-roommates`, { method: 'POST' })
            .then(() => fetchRoommates())
            .catch(err => console.error('Error assigning roommates:', err));
        }}
        style={{ marginLeft: "10px" }}
        disabled={loading}
      >
        Assign Roommates
      </button>
      
      <button
        onClick={() => setShowRoommates(!showRoommates)}
        style={{ marginLeft: "10px" }}
        disabled={loading}
      >
        {showRoommates ? "Hide Roommate Pairs" : "Show Roommate Pairs"}
      </button>

      {loading && <p>Loading...</p>}

      <ForceGraph2D
        graphData={displayData}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkLabel={linkLabel}
        nodeColor={nodeColor}
        nodeVal={nodeVal}
        width={900}
        height={600}

        nodeCanvasObject={(node, ctx, globalScale) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeVal, 0, 2 * Math.PI, false);
          ctx.fillStyle = nodeColor(node);
          ctx.fill();

          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(node.id, node.x, node.y - nodeVal - 2);
        }}

        linkCanvasObjectMode={() => "after"}
        linkCanvasObject={(link, ctx, globalScale) => {
          if (link.isRoommate) return;

          if (link.weight !== undefined) {
            const MAX_FONT_SIZE = 12;
            const LABEL = String(link.weight);

            const start = link.source;
            const end = link.target;

            const x = (start.x + end.x) / 2;
            const y = (start.y + end.y) / 2;

            const fontSize = MAX_FONT_SIZE / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(LABEL, x, y);
          }
        }}
      />
    </div>
  );
}