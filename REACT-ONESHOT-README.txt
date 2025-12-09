Longhorn Network Lab - Nina Kannan

REACT ONESHOT SETUP:
Hello! The following are the steps that need to be followed in order for this lab 
to work succesfully, hopefully in one shot. These steps assume that you have nothing
on your computer, so feel free to skip steps that ask you to download softwares you 
already have.

NOTE: I created this project in VSCode with a Windows operating system.

Before starting, ensure that you have the following softwares downloaded:
1. Java Development Kit (JDK) 17 or Higher
    Check if already installed:
        java -version
    If you see java version "17.x.x" or higher, skip to step 2. Otherwise:
    Installation:
        Mac:
            brew install openjdk@17
        Windows:
            Download from: https://www.oracle.com/java/technologies/downloads/
            Select "Java 17" → Windows → x64 Installer
            Run the installer and follow the prompts
            Verify installation: java -version

    Linux (Ubuntu/Debian):
        bashsudo apt-get update
        sudo apt-get install openjdk-17-jdk

2. Apache Maven
    Check if already installed:
        mvn -version
    If you see Apache Maven 3.x.x, skip to step 3. Otherwise:
    Installation:
        Mac:
            brew install maven
        Windows:
            Download from: https://maven.apache.org/download.cgi
            Select "Binary zip archive" (apache-maven-3.x.x-bin.zip)
            Extract to C:\Program Files\Apache\maven\apache-maven-3.9.x\
            Add to PATH:
                Search "Environment Variables" in Windows Start Menu
                Click "Environment Variables"
                Under "System Variables", find and edit "Path"
                Click "New" and add: C:\Program Files\Apache\maven\apache-maven-3.9.x\bin
                Click OK on all dialogs

            Open a NEW command prompt and verify: mvn -version

        Linux (Ubuntu/Debian):
            sudo apt-get update
            sudo apt-get install maven

3. Node.js and npm
    Check if already installed:
        node -version
        npm -version
    If you see version numbers for both, skip to step 4. Otherwise:
    Installation:
        Mac:
            brew install node
        Windows:
            Download from: https://nodejs.org/
            Select the "LTS" (Long Term Support) version
            Run the installer (npm is included automatically)
            Verify installation: 
                node -version
                npm -version

        Linux (Ubuntu/Debian):
            curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
            sudo apt-get install -y nodejs

Now that you have all required softwares, we can continue on to actually running the 
program.

1. Download all files for this project from GitHub (or clone project) exactly as they 
are organized, and open them in VSCode. It should work with other editors, but this is 
what I used, so I know it works. 
    With the project open, you should see two main folders: 
     - longhorn-network-lab
     - student-network-backend
    as well as the following
     - Deliverables (contains UML diagrams, state diagram etc)
     - node_modules
     - package-lock.json
     - package.json
    If something seems weird, redownload the project from GitHub
2. In the terminal, use commands to navigate to student-network-backend
        Use this command: cd student-network-backend
    Then, run this command: mvn clean install
    Once it shows a message that says "BUILD SUCESS" you can continue to the next step
3. Start the backend server by running:
        mvn spring-boot:run
    Once you see a message that looks like this: 
        2025-12-08T11:05:34.750-06:00  INFO 23584 --- [main] com.student.network.
        StudentNetworkAPI: Started StudentNetworkAPI in 4.272 seconds (process running
        for 4.914)
    that means the backend server is running successfully. If any errors occur, ensure 
    that you are in the right location: .../LonghornNetwork/student-network-backend

4.  Open a NEW TERMINAL, and use commands to navigate to longhorn-network-lab
        Use this command: cd longhorn-network-lab
    Then, run this command to install dependencies for the front end: npm install
    This should install everything, but in case any errors arise, these are some of
    the additional packages I installed that may not have downloaded intially (only 
    do these if step 5 fails):
        npm install react-router-dom
        npm install react-force-graph
        npm install react-force-graph-2d

5. Now, start the React frontend, run the following command
        npm run dev
    This should result in some output that looks like this
     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
     ➜  press h + enter to show help
    If any errors occur, then return to step 4 and see if any other dependencies 
    need to be installed.
    If it is successful, open the URL listed at "Local:" in some browser.
    You should now be able to see the React application!

AI USAGE QUESTIONS
a. Did you use AI to code the UI? If so, what were the sources that the AI used, 
   what was the AI good at and what was it not so good at? What did you do to fill
   in the gaps. 
    I used AI to help guide me in beginning the process of creating the React interface 
    and integrating it with the Java backend. I had never used React before so I used AI
    to get familiar with how it works, how to start, and how the connection process works. 
    It also helped me a lot when I was troubleshooting, because I did have quite a bit of 
    trouble when I was trying to connect the backend and front-end. 

    The AI was really good at giving me instructions on what I needed to complete, but 
    sometimes misguided me when trying to actually write the code. Thats why I mainly used 
    it to get some direction on what I needed to do, and to find errors in the code I had 
    written. I filled in any gaps by watching Youtube video tutorials on coding the UI.

b. If you did not use AI, what sources did you use to learn React, and what were the 
   hardest things to learn? 
    Outside of AI, I used many Youtube tutorials to learn React, the React.dev website, 
    and other online sources. The most difficult part to learn was connecting the backend 
    and front end, so I used AI to help me consider different ways to do it, and the steps 
    I needed to take for it to work.

c. We are planning to cover React next semester for this class, in what unit do you think 
   this would be appropriate to teach?
    I think that this would be appropriate to teach at the same time that Swing was 
    covered for us. It uses a lot of the same or similar concepts. It also uses some 
    networking principles like ports and stuff like that so that also makes sense to teach
     it around that time. The one thing that would make it difficult is how different it 
     is from Java. 

