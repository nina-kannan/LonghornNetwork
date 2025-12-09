import { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

const API_BASE = 'http://localhost:8080/api';

const NODE_SIZE = 6;

export default function ReferralPath() {
  const [selectedCase, setSelectedCase] = useState("1");
  const [startStudent, setStartStudent] = useState("");
  const [company, setCompany] = useState("");
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [referralPath, setReferralPath] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load test case from backend
  const loadTestCase = async (caseNumber) => {
    setLoading(true);
    try {
      await fetch(`${API_BASE}/load-testcase/${caseNumber}`, {
        method: 'POST'
      });
      await fetchGraphData();
      setReferralPath([]); // Clear previous path
    } catch (error) {
      console.error('Error loading test case:', error);
    }
    setLoading(false);
  };

  // Fetch graph data
  const fetchGraphData = async () => {
    try {
      const response = await fetch(`${API_BASE}/graph`);
      const data = await response.json();
      setGraphData(data);
      
      // Set default start student to first node
      if (data.nodes.length > 0 && !startStudent) {
        setStartStudent(data.nodes[0].id);
      }
    } catch (error) {
      console.error('Error fetching graph:', error);
    }
  };

  // Find referral path
  const findPath = async () => {
    if (!startStudent || !company) {
      alert('Please select a student and enter a company name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/referral-path?startStudent=${encodeURIComponent(startStudent)}&targetCompany=${encodeURIComponent(company)}`
      );
      const data = await response.json();
      
      if (data.found) {
        setReferralPath(data.path);
      } else {
        setReferralPath([]);
        alert('No referral path found to that company');
      }
    } catch (error) {
      console.error('Error finding referral path:', error);
      alert('Error finding referral path');
    }
    setLoading(false);
  };

  // Load initial data
  useEffect(() => {
    loadTestCase(1);
  }, []);

  // Highlight links in the path
  const highlightLinks = [];
  for (let i = 0; i < referralPath.length - 1; i++) {
    highlightLinks.push({
      source: referralPath[i],
      target: referralPath[i + 1]
    });
  }

  const linkColor = (link) => {
    const source = link.source.id || link.source;
    const target = link.target.id || link.target;
    
    const isHighlighted = highlightLinks.some(
      hl => (hl.source === source && hl.target === target) ||
            (hl.source === target && hl.target === source)
    );
    
    return isHighlighted ? "#DE541E" : "black";
  };

  const linkWidth = (link) => {
    const source = link.source.id || link.source;
    const target = link.target.id || link.target;
    
    const isHighlighted = highlightLinks.some(
      hl => (hl.source === source && hl.target === target) ||
            (hl.source === target && hl.target === source)
    );
    
    return isHighlighted ? 3 : 2;
  };

  const nodeColor = (node) => {
    if (referralPath.includes(node.id)) {
      if (node.id === startStudent) return "#EDE7E3";
      if (node.id === referralPath[referralPath.length - 1]) return "#FFA62B";
      return "#489FB5";
    }
    return "#82C0CC";
  };

  return (
    <div style={{ padding: '20px', maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: "#EDE7E3" }}>Referral Path Finder</h1>

      <div style={{ 
        backgroundColor: '#489FB5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px', margin: '0 auto'
      }}>
        <select
          value={selectedCase}
          onChange={(e) => {
            setSelectedCase(e.target.value);
            loadTestCase(parseInt(e.target.value));
          }}
          style={{ padding: '8px', minWidth: '200px', marginRight: '20px', border: '2px solid #82C0CC', borderRadius: '4px'}}
          disabled={loading}
        >
          <option value="1">Test Case 1</option>
          <option value="2">Test Case 2</option>
          <option value="3">Test Case 3</option>
        </select>

        <select
          value={startStudent}
          onChange={(e) => setStartStudent(e.target.value)}
          style={{ padding: '8px', minWidth: '200px', marginRight: '20px', border: '2px solid #82C0CC', borderRadius: '4px'}}
          disabled={loading}
        >
          <option value="">Choose a student...</option>
          {graphData.nodes.map((n) => (
            <option key={n.id} value={n.id}>{n.id}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Target company (e.g., DummyCompany)"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ padding: '8px', minWidth: '200px', marginRight: '20px', border: '2px solid #82C0CC', borderRadius: '4px'}}
          disabled={loading}
        />

        <button
          onClick={findPath}
          style={{ marginLeft: 10,  border: "2px solid #82C0CC" }}
          disabled={loading || !startStudent || !company}
        >
          Find Path
        </button>
      </div>

      {referralPath.length > 0 && (
        <div style={{ 
          backgroundColor: '#82C0CC', 
          padding: 15, 
          borderRadius: 5,
          marginBottom: 20,
          marginTop: 20
        }}>
          <h3>Referral Path Found:</h3>
          <p style={{ fontSize: 18, fontWeight: 'bold' }}>
            {referralPath.join(' → ')}
          </p>
        </div>
      )}

      {loading && <p>Loading...</p>}

      <ForceGraph2D
        graphData={graphData}
        linkColor={linkColor}
        linkWidth={linkWidth}
        nodeColor={nodeColor}
        width={800}
        height={400}
        nodeLabel={node => node.id}

        d3ForceConfig={{
          // Pulls nodes closer together
          charge: (force) => force.strength(-10),

          // Pull everything toward the center so groups don't float away
          center: (force) => force.strength(1.2),

          // Increase overall gravity force
          gravity: (force) => force.strength(0.5),
        }}


        nodeCanvasObject={(node, ctx, globalScale) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, NODE_SIZE, 0, 2 * Math.PI, false);
          ctx.fillStyle = nodeColor(node);
          ctx.fill();

          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.textBaseline = "bottom";
          ctx.fillText(node.id, node.x, node.y - NODE_SIZE - 2);
        }}


        linkCanvasObjectMode={() => "after"}
        linkCanvasObject={(link, ctx, globalScale) => {
          if (link.weight !== undefined) {
            const MAX_FONT_SIZE = 12;
            const LABEL = String(link.weight);

            const start = link.source;
            const end = link.target;

            const x = (start.x + end.x) / 2;
            const y = (start.y + end.y) / 2;

            const fontSize = MAX_FONT_SIZE / globalScale;
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(LABEL, x, y);
          }
        }}
      />
    </div>
  );
}