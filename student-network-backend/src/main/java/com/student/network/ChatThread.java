package com.student.network;

import java.util.concurrent.Semaphore;
/**
 * ChatThread handles sending a chat message from one UniversityStudent to another in a separate thread.
 * Implements Runnable for concurrent execution.
 */
public class ChatThread implements Runnable {
    private UniversityStudent sender;
    private UniversityStudent receiver;
    private String message;
    private static final Semaphore semaphore = new Semaphore(1);

    /**
     * Constructs a ChatThread with the given sender, receiver, and message.
     *
     * @param sender   the UniversityStudent sending the message
     * @param receiver the UniversityStudent receiving the message
     * @param message  the message to be sent
     */
    public ChatThread(UniversityStudent sender, UniversityStudent receiver, String message) {
        this.sender = sender;
        this.receiver = receiver;
        this.message = message;
    }

    /**
     * Runs the chat thread, sending the message from sender to receiver.
        * <p>This method acquires a shared semaphore to ensure console output for
        * chat messages remains thread-safe. Interrupted exceptions are caught and
        * the thread's interrupt status is restored.</p>
     */
    @Override
    public void run() {
        try {
            semaphore.acquire();
            System.out.println("Chat (Thread-Safe): " + sender.name + " to " + receiver.name + ": " + message);

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            System.err.println("Chat interrupted: " + e.getMessage());
        } finally {
            semaphore.release();
        }
    }
}