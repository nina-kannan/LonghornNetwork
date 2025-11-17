import java.util.*;

/**
 * Abstract base class representing a student with common attributes and behaviors.
 */
public abstract class Student {
    /** The student's name. */
    protected String name;
    /** The student's age. */
    protected int age;
    /** The student's gender. */
    protected String gender;
    /** The student's academic year. */
    protected int year;
    /** The student's major. */
    protected String major;
    /** The student's GPA. */
    protected double gpa;
    /** List of roommate preferences. */
    protected List<String> roommatePreferences;
    /** List of previous internships. */
    protected List<String> previousInternships;

    /**
     * Calculates the connection strength between this student and another student.
     *
     * @param other the other student to compare with
     * @return the connection strength as an integer
     */
    public abstract int calculateConnectionStrength(Student other);
}
