import java.util.*;

/**
 * UniversityStudent represents a concrete student at a university and extends Student.
 * <p>
 * It stores roommate links, preferences and previous internships and implements
 * a simple connection-strength heuristic used by the graph-building code.
 *
 */
public class UniversityStudent extends Student {
    /** The currently assigned roommate (may be null). */
    private UniversityStudent roommate;

    /**
     * Constructs a UniversityStudent with the provided fields.
     *
     * @param name                 the student's name
     * @param age                  the student's age
     * @param gender               the student's gender
     * @param year                 the student's academic year
     * @param major                the student's major
     * @param gpa                  the student's GPA
     * @param roommatePreferences  ordered list of preferred roommate names
     * @param previousInternships  list of company names for prior internships
     */
    public UniversityStudent(String name, int age, String gender, int year, String major, double gpa,
                             List<String> roommatePreferences, List<String> previousInternships) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = roommatePreferences == null ? new ArrayList<>() : roommatePreferences;
        this.previousInternships = previousInternships == null ? new ArrayList<>() : previousInternships;
        this.roommate = null;
    }

    /**
     * Sets this student's current roommate.
     *
     * @param roommate the roommate to assign (may be null to clear the roommate)
     */
    public void setRoommate(UniversityStudent roommate) {
        this.roommate = roommate;
    }

    /**
     * Returns the currently assigned roommate, or null if none assigned.
     *
     * @return the assigned roommate or null
     */
    public UniversityStudent getRoommate() {
        return roommate;
    }

    /**
     * A simple heuristic measuring connection strength between two students.
    * <p>
     * Scoring rules used by the algorithm:
     * <ul>
     *   <li>+4 if students are roommates</li>
     *   <li>+3 for each shared previous internship</li>
     *   <li>+2 if they share the same major</li>
     *   <li>+1 if they have the same age</li>
    * </ul>
     *
     * @param other the other student to compare with
     * @return integer score representing connection strength (>=0)
     */
    public int calculateConnectionStrength(Student other) {
        int strength = 0;
        if (other instanceof UniversityStudent) {
            UniversityStudent o = (UniversityStudent) other;

            if (this.roommate != null && this.roommate.equals(o)) {
                strength += 4;
            }

            for (String internship : this.previousInternships) {
                if (o.previousInternships.contains(internship)) {
                    strength += 3;
                }
            }

            if (this.major != null && this.major.equals(o.major)) {
                strength += 2;
            }

            if (this.age == o.age) {
                strength += 1;
            }
        }
        return strength;
    }

}

