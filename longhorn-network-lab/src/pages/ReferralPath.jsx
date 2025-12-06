import { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";

const API_BASE = 'http://localhost:8080/api';

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
    
    return isHighlighted ? "red" : "gray";
  };

  const linkWidth = (link) => {
    const source = link.source.id || link.source;
    const target = link.target.id || link.target;
    
    const isHighlighted = highlightLinks.some(
      hl => (hl.source === source && hl.target === target) ||
            (hl.source === target && hl.target === source)
    );
    
    return isHighlighted ? 3 : 1;
  };

  const nodeColor = (node) => {
    if (referralPath.includes(node.id)) {
      if (node.id === startStudent) return "green";
      if (node.id === referralPath[referralPath.length - 1]) return "orange";
      return "yellow";
    }
    return "lightblue";
  };

  return (
    <div>
      <h1>Referral Path Finder</h1>

      <div style={{ marginBottom: 20 }}>
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

        <select
          value={startStudent}
          onChange={(e) => setStartStudent(e.target.value)}
          style={{ padding: '8px', minWidth: '200px', marginRight: '20px' }}
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
          style={{ padding: '8px', minWidth: '200px', marginRight: '20px' }}
          disabled={loading}
        />

        <button
          onClick={findPath}
          style={{ marginLeft: 10 }}
          disabled={loading || !startStudent || !company}
        >
          Find Path
        </button>
      </div>

      {referralPath.length > 0 && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          padding: 15, 
          borderRadius: 5,
          marginBottom: 20 
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
        height={600}
        nodeLabel={node => node.id}
      />
    </div>
  );
}