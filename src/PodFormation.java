import java.util.*;

/**
 * PodFormation is responsible for forming pods (groups) of students based on the provided student graph.
 * <p>
 * Implementations may use the connectivity/weights in {@link StudentGraph} to
 * cluster compatible students into groups (pods). The class currently accepts a
 * {@code StudentGraph} in the constructor; the actual grouping algorithm is
 * left as an exercise for the lab.
 * </p>
 */
public class PodFormation {
    /**
     * Constructs a PodFormation object with the given student graph.
     *
    * @param graph the StudentGraph representing student relationships; callers
    *              are expected to provide a previously built graph instance
     */
    public PodFormation(StudentGraph graph) {
        // Constructor
    }

    /**
    * Forms pods of students with the specified pod size. The method should
    * partition the students into groups of approximately {@code podSize}; how
    * leftover students are handled is implementation-dependent (could leave a
    * small remainder group).
     *
     * @param podSize the desired size of each pod
     */
    public void formPods(int podSize) {
        // Method signature only
    }
}
