import { useState, useEffect } from "react";

const API_BASE = 'http://localhost:8080/api';

export default function ChatHistory() {
  const [students, setStudents] = useState([]);
  const [studentA, setStudentA] = useState("");
  const [studentB, setStudentB] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all students when component loads
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE}/students`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Fetch chat history when both students are selected
  useEffect(() => {
    if (studentA && studentB && studentA !== studentB) {
      fetchChatHistory();
    }
  }, [studentA, studentB]);

  const fetchChatHistory = async () => {
    if (!studentA || !studentB) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE}/chat-history?student1=${encodeURIComponent(studentA)}&student2=${encodeURIComponent(studentB)}`
      );
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !studentA || !studentB) return;
    
    setLoading(true);
    try {
      await fetch(`${API_BASE}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: studentA,
          receiver: studentB,
          message: newMessage
        })
      });
      
      setNewMessage("");
      await fetchChatHistory();
    } catch (error) {
      console.error('Error sending message:', error);
    }
    setLoading(false);
  };

  const sendFriendRequest = async () => {
    if (!studentA || !studentB) return;
    
    setLoading(true);
    try {
      await fetch(`${API_BASE}/send-friend-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: studentA,
          receiver: studentB
        })
      });
      
      await fetchChatHistory();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
    setLoading(false);
  };

  const simulateThreads = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/simulate-threads`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.success) {
        // Set the participants as selected students
        setStudentA(data.participants[0]);
        setStudentB(data.participants[1]);
        
        // Fetch the new chat history
        setTimeout(() => fetchChatHistory(), 500);
      }
    } catch (error) {
      console.error('Error simulating threads:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>Chat History</h1>

      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Student A:</label>
        <select 
          value={studentA} 
          onChange={(e) => setStudentA(e.target.value)}
          style={{ padding: '8px', minWidth: '200px', marginRight: '20px' }}
        >
          <option value="">Select Student A</option>
          {students.map(s => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.major})
            </option>
          ))}
        </select>

        <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Student B:</label>
        <select 
          value={studentB} 
          onChange={(e) => setStudentB(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        >
          <option value="">Select Student B</option>
          {students.filter(s => s.name !== studentA).map(s => (
            <option key={s.name} value={s.name}>
              {s.name} ({s.major})
            </option>
          ))}
        </select>

      </div>

      {studentA && studentB && studentA !== studentB && (
        <>
          <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: 'white',
            marginBottom: '20px',
            minHeight: '300px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <h3 style={{ marginTop: 0 }}>
              Chat between {studentA} and {studentB}
            </h3>
            
            {loading && <p style={{ color: '#666' }}>Loading...</p>}
            
            {!loading && messages.length === 0 && (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No messages yet. Start a conversation!
              </p>
            )}
            
            {messages.map((msg, idx) => {
              const isFriendRequest = msg.startsWith('[FRIEND REQUEST]');
              const isFromStudentA = msg.startsWith(studentA + ':');
              
              return (
                <div 
                  key={idx} 
                  style={{ 
                    padding: '10px',
                    marginBottom: '10px',
                    borderRadius: '5px',
                    backgroundColor: isFriendRequest 
                      ? '#fff9c4' 
                      : isFromStudentA 
                        ? '#e3f2fd' 
                        : '#f1f8e9',
                    border: isFriendRequest 
                      ? '1px solid #fbc02d' 
                      : '1px solid #ddd'
                  }}
                >
                  {msg}
                </div>
              );
            })}
          </div>

          <div style={{ 
            display: 'flex', 
            gap: '10px',
            alignItems: 'center' 
          }}>
            <button
              onClick={sendFriendRequest}
              disabled={loading || !studentA || !studentB}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading || !studentA || !studentB ? 'not-allowed' : 'pointer',
                opacity: loading || !studentA || !studentB ? 0.6 : 1
              }}
            >
              Send Friend Request
            </button>

            <input
              type="text"
              placeholder={`Send message as ${studentA}...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={loading}
              style={{
                flex: 1,
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
              style={{
                padding: '12px 30px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: loading || !newMessage.trim() ? 'not-allowed' : 'pointer',
                opacity: loading || !newMessage.trim() ? 0.6 : 1,
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              Send
            </button>
          </div>
        </>
      )}

      {(!studentA || !studentB || studentA === studentB) && (
        <div style={{ 
          padding: '40px',
          textAlign: 'center',
          color: '#666',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px'
        }}>
          <p>Select two different students to view their chat history</p>
        </div>
      )}
    </div>
  );
}