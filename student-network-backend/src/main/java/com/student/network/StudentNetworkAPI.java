package com.student.network;

import org.springframework.web.bind.annotation.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.util.*;

@SpringBootApplication
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentNetworkAPI {

    private List<UniversityStudent> students = new ArrayList<>();
    private StudentGraph graph;
    private Map<String, List<String>> chatHistory = new HashMap<>();

    public static void main(String[] args) {
        SpringApplication.run(StudentNetworkAPI.class, args);
    }

    @PostMapping("/load-testcase/{caseNumber}")
    public Map<String, Object> loadTestCase(@PathVariable int caseNumber) {
        switch (caseNumber) {
            case 1: students = Main.generateTestCase1(); break;
            case 2: students = Main.generateTestCase2(); break;
            case 3: students = Main.generateTestCase3(); break;
            default: students = Main.generateTestCase1();
        }
        graph = new StudentGraph(students);
        
        return Map.of(
            "message", "Test case " + caseNumber + " loaded",
            "studentCount", students.size()
        );
    }

    @GetMapping("/graph")
    public Map<String, Object> getGraph() {
        if (graph == null || students.isEmpty()) {
            return Map.of("nodes", List.of(), "links", List.of());
        }

        List<Map<String, String>> nodes = new ArrayList<>();
        List<Map<String, Object>> links = new ArrayList<>();
        
        for (UniversityStudent s : students) {
            nodes.add(Map.of("id", s.name));
        }
        
        Set<String> processed = new HashSet<>();
        for (UniversityStudent s : graph.getAllNodes()) {
            for (StudentGraph.Edge edge : graph.getNeighbors(s)) {
                String key1 = s.name + "-" + edge.neighbor.name;
                String key2 = edge.neighbor.name + "-" + s.name;
                
                if (!processed.contains(key1) && !processed.contains(key2)) {
                    links.add(Map.of(
                        "source", s.name,
                        "target", edge.neighbor.name,
                        "weight", edge.weight
                    ));
                    processed.add(key1);
                }
            }
        }
        
        return Map.of("nodes", nodes, "links", links);
    }

    @GetMapping("/roommates")
    public Map<String, Object> getRoommates() {
        List<Map<String, String>> pairs = new ArrayList<>();
        Set<String> processed = new HashSet<>();
        
        for (UniversityStudent s : students) {
            if (s.getRoommate() != null && !processed.contains(s.name)) {
                pairs.add(Map.of(
                    "source", s.name,
                    "target", s.getRoommate().name
                ));
                processed.add(s.name);
                processed.add(s.getRoommate().name);
            }
        }
        
        return Map.of("roommateLinks", pairs);
    }

    @PostMapping("/assign-roommates")
    public Map<String, Object> assignRoommates() {
        GaleShapley.assignRoommates(students);
        
        List<Map<String, String>> pairs = new ArrayList<>();
        Set<String> processed = new HashSet<>();
        
        for (UniversityStudent s : students) {
            if (s.getRoommate() != null && !processed.contains(s.name)) {
                pairs.add(Map.of(
                    "student1", s.name,
                    "student2", s.getRoommate().name
                ));
                processed.add(s.name);
                processed.add(s.getRoommate().name);
            }
        }
        
        return Map.of("pairs", pairs, "message", "Roommates assigned");
    }

    @GetMapping("/referral-path")
    public Map<String, Object> findReferralPath(
            @RequestParam String startStudent,
            @RequestParam String targetCompany) {
        
        UniversityStudent start = findStudent(startStudent);
        if (start == null) {
            return Map.of("error", "Student not found", "path", List.of());
        }

        if (graph == null) {
            graph = new StudentGraph(students);
        }

        ReferralPathFinder finder = new ReferralPathFinder(graph);
        List<UniversityStudent> path = finder.findReferralPath(start, targetCompany);
        
        List<String> pathNames = path.stream()
            .map(s -> s.name)
            .toList();
        
        return Map.of(
            "path", pathNames,
            "found", !pathNames.isEmpty()
        );
    }

    /**
     * Get all students (for dropdowns)
     */
    @GetMapping("/students")
    public List<Map<String, String>> getStudents() {
        List<Map<String, String>> studentList = new ArrayList<>();
        for (UniversityStudent s : students) {
            studentList.add(Map.of(
                "name", s.name,
                "major", s.major
            ));
        }
        return studentList;
    }

    /**
     * Get chat history between two students
     */
    @GetMapping("/chat-history")
    public Map<String, Object> getChatHistory(
            @RequestParam String student1,
            @RequestParam String student2) {
        
        // Create bidirectional keys
        String key1 = student1 + "-" + student2;
        String key2 = student2 + "-" + student1;
        
        List<String> messages = chatHistory.getOrDefault(key1, 
                            chatHistory.getOrDefault(key2, new ArrayList<>()));
        
        return Map.of(
            "messages", messages,
            "student1", student1,
            "student2", student2
        );
    }

    /**
     * Send a chat message (simulates the ChatThread functionality)
     */
    @PostMapping("/send-message")
    public Map<String, Object> sendMessage(@RequestBody Map<String, String> payload) {
        String sender = payload.get("sender");
        String receiver = payload.get("receiver");
        String message = payload.get("message");
        
        // Find students
        UniversityStudent senderStudent = findStudent(sender);
        UniversityStudent receiverStudent = findStudent(receiver);
        
        if (senderStudent == null || receiverStudent == null) {
            return Map.of("error", "Student not found");
        }
        
        // Store chat with consistent key (alphabetical order)
        String chatKey = getChatKey(sender, receiver);
        chatHistory.putIfAbsent(chatKey, new ArrayList<>());
        
        String formattedMessage = sender + ": " + message;
        chatHistory.get(chatKey).add(formattedMessage);
        
        // Simulate thread execution (mimics ChatThread)
        System.out.println("Chat (Thread-Safe): " + sender + " to " + receiver + ": " + message);
        
        return Map.of(
            "success", true,
            "message", "Message sent",
            "chatKey", chatKey
        );
    }

    /**
     * Send friend request (simulates FriendRequestThread)
     */
    @PostMapping("/send-friend-request")
    public Map<String, Object> sendFriendRequest(@RequestBody Map<String, String> payload) {
        String sender = payload.get("sender");
        String receiver = payload.get("receiver");
        
        UniversityStudent senderStudent = findStudent(sender);
        UniversityStudent receiverStudent = findStudent(receiver);
        
        if (senderStudent == null || receiverStudent == null) {
            return Map.of("error", "Student not found");
        }
        
        // Simulate thread execution (mimics FriendRequestThread)
        System.out.println("FriendRequest (Thread-Safe): " + sender + " sent a friend request to " + receiver);
        
        // Store as a chat message
        String chatKey = getChatKey(sender, receiver);
        chatHistory.putIfAbsent(chatKey, new ArrayList<>());
        chatHistory.get(chatKey).add("[FRIEND REQUEST] " + sender + " sent a friend request to " + receiver);
        
        return Map.of(
            "success", true,
            "message", "Friend request sent"
        );
    }

    /**
     * Simulate concurrent chat/friend request operations
     */
    @PostMapping("/simulate-threads")
    public Map<String, Object> simulateThreads() {
        if (students.size() < 2) {
            return Map.of("error", "Need at least 2 students loaded");
        }
        
        UniversityStudent s1 = students.get(0);
        UniversityStudent s2 = students.get(1);
        
        // Simulate the concurrent operations from Main.java test
        String chatKey = getChatKey(s1.name, s2.name);
        chatHistory.putIfAbsent(chatKey, new ArrayList<>());
        
        // Simulate FriendRequestThread
        System.out.println("FriendRequest (Thread-Safe): " + s1.name + " sent a friend request to " + s2.name);
        chatHistory.get(chatKey).add("[FRIEND REQUEST] " + s1.name + " → " + s2.name);
        
        // Simulate ChatThread
        System.out.println("Chat (Thread-Safe): " + s1.name + " to " + s2.name + ": Hello there!");
        chatHistory.get(chatKey).add(s1.name + ": Hello there!");
        
        System.out.println("FriendRequest (Thread-Safe): " + s2.name + " sent a friend request to " + s1.name);
        chatHistory.get(chatKey).add("[FRIEND REQUEST] " + s2.name + " → " + s1.name);
        
        System.out.println("Chat (Thread-Safe): " + s2.name + " to " + s1.name + ": Hi back!");
        chatHistory.get(chatKey).add(s2.name + ": Hi back!");
        
        return Map.of(
            "success", true,
            "message", "Thread simulation complete",
            "participants", List.of(s1.name, s2.name)
        );
    }

    /**
     * Helper method to create consistent chat keys
     */
    private String getChatKey(String name1, String name2) {
        // Always use alphabetical order for consistency
        return name1.compareTo(name2) < 0 ? name1 + "-" + name2 : name2 + "-" + name1;
    }


    private UniversityStudent findStudent(String name) {
        return students.stream()
            .filter(s -> s.name.equals(name))
            .findFirst()
            .orElse(null);
    }
}