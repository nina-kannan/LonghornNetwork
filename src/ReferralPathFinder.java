import java.util.*;

/**
 * ReferralPathFinder finds referral paths for students to target companies using the student graph.
 */
public class ReferralPathFinder {
    private StudentGraph graph;
    /**
     * Constructs a ReferralPathFinder with the given student graph.
     *
     * @param graph the StudentGraph representing student relationships
     */
    public ReferralPathFinder(StudentGraph graph) {
        // Constructor
        this.graph = graph;
    }

    /**
     * Finds a referral path from the starting UniversityStudent to a target company.
     *
     * <p>The method performs a Dijkstra-style exploration over the student graph
     * where edge weights represent connection strength; a lower cost path is
     * preferred. During traversal, if a student is found who previously
     * interned at {@code targetCompany}, a path from {@code start} to that
     * student is reconstructed and returned.</p>
     *
     * @param start         the starting UniversityStudent (must be in the graph)
     * @param targetCompany the company to find a referral path to (case-insensitive)
     * @return a list of {@link UniversityStudent} objects representing the referral path
     *         from {@code start} -> ... -> studentWithInternAt(targetCompany). If no
     *         such path exists an empty list is returned.
     */
    public List<UniversityStudent> findReferralPath(UniversityStudent start, String targetCompany) {
        Map<UniversityStudent, Double> dist = new HashMap<>();
        Map<UniversityStudent, UniversityStudent> prev = new HashMap<>();
        Set<UniversityStudent> visited = new HashSet<>();

        for (UniversityStudent s : graph.getAllNodes()) {
            dist.put(s, Double.MAX_VALUE);
            prev.put(s, null);
        }

        dist.put(start, 0.0);

        PriorityQueue<UniversityStudent> pq = new PriorityQueue<>(Comparator.comparingDouble(dist::get));
        pq.add(start);

        while (!pq.isEmpty()) {
            UniversityStudent u = pq.poll();
            if (visited.contains(u)) {
                continue;
            }
            visited.add(u); 

            for (String internship : u.previousInternships) {
                if (internship.equalsIgnoreCase(targetCompany)) {
                    List<UniversityStudent> path = new ArrayList<>();
                    UniversityStudent curr = u;
                    while (curr != null) {
                        path.add(curr);
                        curr = prev.get(curr);
                    }
                    Collections.reverse(path);
                    return path;
                }
            }

            //check if its the optimal path to each neighbor (relaxation)
            for (StudentGraph.Edge edge : graph.getNeighbors(u)) {
                UniversityStudent v = edge.neighbor;
                if (visited.contains(v)) {
                    continue;
                }
                double newDist = dist.get(u) + 1.0 / edge.weight;
                if (newDist < dist.get(v)) {
                    dist.put(v, newDist);
                    prev.put(v, u);
                    pq.add(v);
                }
            }
        }

        return new ArrayList<>(); // No path found
    }
}
