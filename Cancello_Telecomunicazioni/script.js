// Wait for the document to be ready
$(document).ready(function () {
  // Get references to HTML elements
  const gateBody = $("#gate-body");
  const btnOpen = $("#btnOpen");
  const btnClose = $("#btnClose");
  const statusText = $("#statusText");
  const countdownText = $("#countdownText");

  // Initialize state variables
  let isOpen = false;
  let isMoving = false;
  let countdownInterval;
  let lastButton;

  // Function to update the state of buttons based on gate status
  function updateButtonState() {
    btnOpen.prop("disabled", isOpen || isMoving);
    btnClose.prop("disabled", isMoving);
  }

  // Function to update the displayed status text
  function updateStatusText() {
    if (isMoving) {
      statusText.text("In Movimento");
    } else if (isOpen) {
      statusText.text("Aperto");
    } else {
      statusText.text("Chiuso");
    }
  }

  // Function to toggle the gate open/close
  function toggleGate() {
    // Define the transformation based on gate status
    const gateTransform = isOpen ? "translateX(0)" : "translateX(-100%)";
    gateBody.css({ transform: gateTransform });

    // Set a timeout to update the state after the animation
    setTimeout(function () {
      isOpen = !isOpen;
      isMoving = false;
      updateButtonState();
      updateStatusText();
      // If the gate is open, start the auto-close countdown
      if (isOpen) {
        startAutoCloseCountdown();
        // Alert when the gate is successfully opened
        showAlert("Cancello aperto con successo!");
      } else {
        // Alert when the gate is successfully closed
        showAlert("Cancello chiuso con successo!");
      }
    }, 5000); // 5 seconds duration for the animation
  }

  // Function to start the auto-close countdown
  function startAutoCloseCountdown() {
    let countdown = 30;
    countdownText.text(countdown + "s");

    // Update countdown every second
    countdownInterval = setInterval(function () {
      countdown--;
      countdownText.text(countdown + "s");
      // If countdown reaches 0 and gate is open and not moving, trigger auto-close
      if (countdown <= 0 && isOpen && !isMoving) {
        isMoving = true;
        updateButtonState();
        updateStatusText();
        toggleGate();
      }
    }, 1000); // 1 second interval
  }

  // Function to reset the auto-close countdown
  function resetCountdown() {
    clearInterval(countdownInterval);
    countdownText.text("");
  }

  // Function to clear the stop timeout
  function clearStopTimeout() {
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }
  }

  // Function to show an alert message
  function showAlert(message) {
    alert(message);
  }

  // Event handler for the "Open" button click
  btnOpen.on("click", function () {
    console.log("Open button clicked");
    if (!isMoving) {
      // Check if the gate is closed or last action was "Close"
      if (!isOpen || lastButton === "Close") {
        isMoving = true;
        updateButtonState();
        updateStatusText();
        toggleGate();
        lastButton = "Open";
      } else {
        console.log("Open button clicked again");
        // If clicked again, stop and close after 2 seconds
        clearStopTimeout();
        stopTimeout = setTimeout(function () {
          resetCountdown();
          toggleGate();
        }, 2000);
      }
    }
  });

  // Event handler for the "Close" button click
  btnClose.on("click", function () {
    console.log("Close button clicked");
    if (!isMoving) {
      // Check if the gate is open or last action was "Open"
      if (isOpen || lastButton === "Open") {
        isMoving = true;
        updateButtonState();
        updateStatusText();
        resetCountdown();
        toggleGate();
        lastButton = "Close";
      } else {
        console.log("Close button clicked again");
        // If clicked again, stop and start auto-close after 2 seconds
        clearStopTimeout();
        stopTimeout = setTimeout(function () {
          startAutoCloseCountdown();
        }, 2000);
      }
    }
  });

  // Initial setup of buttons and status text
  updateButtonState();
  updateStatusText();
});
