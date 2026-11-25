            // Load previously saved reservations
            const savedBookings = localStorage.getItem("nookBookings");

            // Convert saved reservations into an array
            const bookings = savedBookings ? JSON.parse(savedBookings) : [];

            // Find the bookings container
            const bookingsContainer = document.getElementById("bookings-container");

            // Map workspace IDs to workspace names
            const workspaceNames = {
                1: "Executive Meeting Room",
                2: "Private Office",
                3: "Conference Room",
                4: "Individual Desk"
            };
            // Cancel a specific reservation
            function cancelBooking(bookingId) {

                // Find the reservation using its unique ID
                const bookingIndex = bookings.findIndex(function(booking) {
                    return booking.id === bookingId;
                });

                // Check whether the reservation exists
                if (bookingIndex === -1) {
                    alert("Reservation not found.");
                    return;
                }

                const booking = bookings[bookingIndex];

                // Get the reservation start date and time
                const bookingStart = new Date(
                    `${booking.date}T${booking.startTime}`
                );

                // Prevent cancellation after the reservation starts
                if (bookingStart <= new Date()) {
                    alert("You cannot cancel a reservation that has already started.");
                    return;
                }

                // Ask the user to confirm cancellation
                if (!confirm("Are you sure you want to cancel this reservation?")) {
                    return;
                }

                // Remove the selected reservation
                bookings.splice(bookingIndex, 1);

                // Update localStorage
                localStorage.setItem("nookBookings", JSON.stringify(bookings));

                // Refresh the displayed reservations
                displayBookings();

                alert("Reservation cancelled successfully!");
            }
            // Determine the current status of a reservation
            function getBookingStatus(booking) {

                const now = new Date();

                const bookingStart = new Date(
                    `${booking.date}T${booking.startTime}`
                );

                const bookingEnd = new Date(
                    `${booking.date}T${booking.endTime}`
                );

                if (now < bookingStart) {
                    return "Upcoming";
                }

                if (now < bookingEnd) {
                    return "In Progress";
                }

                return "Completed";
            }
            // Format the booking date
            function formatDate(date) {

                return new Date(`${date}T00:00:00`)
                    .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    });
            }

            // Format the booking time
            function formatTime(time) {

                return new Date(`2000-01-01T${time}`)
                    .toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true
                    });
            }
            // Display saved reservations
            function displayBookings() {

                // Clear existing booking cards
                bookingsContainer.innerHTML = "";

                // Handle an empty bookings array
                if (bookings.length === 0) {
                    bookingsContainer.textContent =
                        "You do not have any reservations yet.";
                    return;
                }

                
               // Sort reservations by date and start time
                const sortedBookings = [...bookings].sort(function(a, b) {

                    const startA = new Date(`${a.date}T${a.startTime}`);
                    const startB = new Date(`${b.date}T${b.startTime}`);

                    return startA - startB;
                });

                // Loop through sorted reservations
                sortedBookings.forEach(function(booking) {

                    const card = document.createElement("div");

                    card.className = "workspace-card";

                    card.innerHTML = `
                        <h2></h2>
                        <p class="booking-date"></p>
                        <p class="booking-start"></p>
                        <p class="booking-end"></p>
                        <p class="booking-status"></p>

                        <button class="cancel-button">
                            Cancel Booking
                        </button>
                    `;

                    card.querySelector("h2").textContent =
                        workspaceNames[booking.workspaceId] || "Unknown Workspace";

                    card.querySelector(".booking-date").textContent =
                        "Date: " + formatDate(booking.date);

                    card.querySelector(".booking-start").textContent =
                        "Start Time: " + formatTime(booking.startTime);

                    card.querySelector(".booking-end").textContent =
                        "End Time: " + formatTime(booking.endTime);
                        // Determine and display the booking status
                        const status = getBookingStatus(booking);

                        card.querySelector(".booking-status").textContent =
                            "Status: " + status;
                            // Assign a CSS class based on the booking status
                        card.querySelector(".booking-status").classList.add(
                            status.toLowerCase().replaceAll(" ", "-")
                        );
                        // Find the cancellation button
                        const cancelButton = card.querySelector(".cancel-button");
                        // Disable cancellation for non-upcoming reservations
                        if (status !== "Upcoming") {
                            cancelButton.disabled = true;
                        }

                        // Handle cancellation
                        cancelButton.addEventListener("click", function() {
                            cancelBooking(booking.id);
                        });

                    bookingsContainer.appendChild(card);

                });
            }

            // Display reservations when the page loads
            displayBookings();

            // Automatically refresh booking statuses every 30 seconds
            setInterval(displayBookings, 30000);