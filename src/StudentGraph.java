/**
 * Stub for StudentGraph to allow Javadoc and compilation.
 */
public class StudentGraph {
    /**
     * Represents an edge in the student graph.
     */
    public static class Edge {
        public UniversityStudent neighbor;
        public int weight;
    }

    public StudentGraph(java.util.List<UniversityStudent> students) {}
    public java.util.List<UniversityStudent> getAllNodes() { return java.util.Collections.emptyList(); }
    public java.util.List<Edge> getNeighbors(UniversityStudent s) { return java.util.Collections.emptyList(); }
    public void displayGraph() {}
}
