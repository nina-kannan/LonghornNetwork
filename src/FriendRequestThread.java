import java.util.concurrent.Semaphore;

/**
 * FriendRequestThread handles sending a friend request from one UniversityStudent to another in a separate thread.
 * Implements Runnable for concurrent execution.
 */
public class FriendRequestThread implements Runnable {
    private UniversityStudent sender;
    private UniversityStudent receiver;

    private static final Semaphore semaphore = new Semaphore(1);
    /**
     * Constructs a FriendRequestThread with the given sender and receiver.
     *
     * @param sender   the UniversityStudent sending the friend request
     * @param receiver the UniversityStudent receiving the friend request
     */
    public FriendRequestThread(UniversityStudent sender, UniversityStudent receiver) {
        // Constructor
        this.sender = sender;
        this.receiver = receiver;  
    }

    /**
     * Runs the friend request thread, sending the request from sender to receiver.
     */
    @Override
    public void run() {
        try {
            semaphore.acquire();
            System.out.println("FriendRequest (Thread-Safe): " + sender.name + " sent a friend request to " + receiver.name);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("FriendRequest interrupted: " + e.getMessage());
        } finally {
            semaphore.release();
        }
    }
}
