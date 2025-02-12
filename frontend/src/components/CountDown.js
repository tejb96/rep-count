const CountDown = (countdown, setCountdown) => {
    // Check if the countdown is already at zero
    if (countdown <= 0) {
        console.log("Countdown has already reached zero.");
        return;
    }

    // Set an interval to update the countdown every second (1000 milliseconds)
    const intervalId = setInterval(() => {
        // Decrease the countdown value
        setCountdown(prevCountdown => {
            if (prevCountdown <= 1) {
                clearInterval(intervalId); // Clear interval when countdown reaches zero
                console.log("Countdown finished!");
                return 0; // Set countdown to zero
            }
            return prevCountdown - 1; // Decrement countdown
        });
    }, 1000);

    // Clear the interval when the component unmounts or countdown changes
    return () => clearInterval(intervalId);
};
