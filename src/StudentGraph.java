import java.util.*;

public class StudentGraph {
    /**
     * Represents an edge in the student graph.
     */
    public static class Edge {
        public UniversityStudent neighbor;
        public int weight;

        public Edge(UniversityStudent neighbor, int weight){
            this.neighbor = neighbor;
            this.weight = weight;
        }

        @Override
        public String toString(){
            return "(" + neighbor.name + ", " + weight + ")";
        }
    }

    private Map<UniversityStudent, List<Edge>> adjacencyList;

    public StudentGraph(List<UniversityStudent> students) {
        adjacencyList = new HashMap<>();

        for (UniversityStudent s: students){
            adjacencyList.put(s, new ArrayList<>());
        }
        for (int i = 0; i < students.size(); i++){
            for (int j = i; j < students.size(); j++){
                UniversityStudent s1 = students.get(i);
                UniversityStudent s2 = students.get(j);
                int weight = s1.calculateConnectionStrength(s2);
                if (weight > 0) {
                    addEdge(s1, s2, weight);
                }
            }
        }
    }

    public void addEdge(UniversityStudent s1, UniversityStudent s2, int weight){
        adjacencyList.get(s1).add(new Edge(s2, weight));
        adjacencyList.get(s2).add(new Edge(s1, weight));
    }


    public Set<UniversityStudent> getAllNodes() {
        return adjacencyList.keySet();
    }
    public List<Edge> getNeighbors(UniversityStudent s) { 
        return adjacencyList.get(s);
    }
    public void displayGraph() {
        System.out.println("\nStudent Graph:");
        for (UniversityStudent s: adjacencyList.keySet()){
            System.out.println(s.name + " -> " + adjacencyList.get(s));
        }
    }
}
