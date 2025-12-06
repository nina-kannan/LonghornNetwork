package com.student.network;

import java.util.*;

/**
 * StudentGraph models a simple undirected weighted graph where nodes are
 * {@link UniversityStudent} instances and edges indicate a connection with a
 * positive strength (weight). The graph is used by the lab code for referrals
 * and pod formation.
 */
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

    /**
     * Builds a StudentGraph from the provided list of students. When two students
     * have a positive connection strength (evaluated by
     * {@link UniversityStudent#calculateConnectionStrength(Student)}), an
     * undirected edge is added linking the two nodes.
     *
     * @param students the list of students to include in the graph (must not be null)
     */
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

    /**
     * Adds an undirected edge between two students with the provided weight.
     * Both endpoints must already be present in the graph (i.e., the adjacency
     * list contains entries for each student).
     *
     * @param s1     first student (source)
     * @param s2     second student (destination)
     * @param weight positive integer weight representing connection strength
     */
    public void addEdge(UniversityStudent s1, UniversityStudent s2, int weight) {
        adjacencyList.get(s1).add(new Edge(s2, weight));
        adjacencyList.get(s2).add(new Edge(s1, weight));
    }


    /**
     * Returns all students (nodes) stored in the graph.
     *
     * @return a set of students present in the graph
     */
    public Set<UniversityStudent> getAllNodes() {
        return adjacencyList.keySet();
    }
    /**
     * Returns the neighbor edges for the given student. The returned list may be
     * empty if the student has no neighbors. If the student is not present in
     * the graph, this method returns null.
     *
     * @param s student whose neighbor list is requested
     * @return list of {@link Edge} objects for the student's neighbors
     */
    public List<Edge> getNeighbors(UniversityStudent s) {
        return adjacencyList.get(s);
    }
    /**
     * Prints a compact, human-readable representation of the graph to stdout.
     * This is a convenience/debug helper used by the project's test harness.
     */
    public void displayGraph() {
        System.out.println("\nStudent Graph:");
        for (UniversityStudent s: adjacencyList.keySet()){
            System.out.println(s.name + " -> " + adjacencyList.get(s));
        }
    }
}
