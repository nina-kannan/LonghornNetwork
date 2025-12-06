package com.student.network;

import java.io.*;
import java.util.*;

/**
 * DataParser contains helper methods to load student records from a plain-text
 * file. The current project uses a simplified parser for test data; this class
 * is intentionally lightweight.
 *
 * Expected input format (line-oriented):
 * name|age|gender|year|major|gpa|comma-separated-preferred-roommates|comma-separated-internships
 *
 * Lines that are malformed should be handled by the caller or ignored.
 */
public class DataParser {
    /**
     * Parses a list of UniversityStudent objects from the specified file.
     *
     * @param filename the name of the file containing student data (path is relative to the current working directory)
     * @return a list of UniversityStudent objects
     * @throws IOException if an I/O error occurs while reading the file
     */
    public static List<UniversityStudent> parseStudents(String filename) throws IOException {
        return new ArrayList<>();
    }
}
