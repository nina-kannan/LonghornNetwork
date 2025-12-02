import java.util.*;

/**
 * UniversityStudent represents a student at a university, extending the base Student class.
 */
public class UniversityStudent extends Student {
    // TODO: Constructor and additional methods to be implemented
    private UniversityStudent roommate;

    public UniversityStudent(String name, int age, String gender, int year, String major, double gpa,
                             List<String> roommatePreferences, List<String> previousInternships){
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.year = year;
        this.major = major;
        this.gpa = gpa;
        this.roommatePreferences = roommatePreferences;
        this.previousInternships = previousInternships;
        this.roommate = null;
}
    public void setRoommate(UniversityStudent roommate){
        this.roommate = roommate;
    }
    public UniversityStudent getRoommate(){
        return roommate;
    }
    public int calculateConnectionStrength(Student other){
        int strength = 0;
        if (other instanceof UniversityStudent){
            UniversityStudent o = (UniversityStudent) other;
            
            if (this.roommate != null && this.roommate.equals(o)){
                strength += 4;
            }

            for (String internship : this.previousInternships) {
                if (o.previousInternships.contains(internship)) {
                    strength += 3;
                }
            }

            if (this.major.equals(o.major)) {
                strength += 2;
            }

            if (this.age == o.age) {
                strength += 1;
            }
        }
        return strength;
    }

}

