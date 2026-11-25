        // Workspace data

        const workspaces = [
            {
                id: 1,
                name: "Executive Meeting Room",
                capacity: 8
            },

            {
                id: 2,
                name: "Private Office",
                capacity: 2
            },

            {
                id: 3,
                name: "Conference Room",
                capacity: 12
            },

            {
                id: 4,
                name: "Individual Desk",
                capacity: 1
            }
        ];

    // Load previously saved reservations
    const savedBookings = localStorage.getItem("nookBookings");

    // Store reservations with dates and times
    const bookings = savedBookings ? JSON.parse(savedBookings) : [];
    // Save reservations to localStorage
    function saveBookings() {

        localStorage.setItem("nookBookings", JSON.stringify(bookings));

    }
    // Check whether a reservation overlaps an existing booking
    function hasBookingConflict(newBooking) {

        return bookings.some(function(existingBooking) {

            const sameWorkspace =
                existingBooking.workspaceId === newBooking.workspaceId;

            const sameDate =
                existingBooking.date === newBooking.date;

            const overlappingTime =
                newBooking.startTime < existingBooking.endTime &&
                newBooking.endTime > existingBooking.startTime;

            return sameWorkspace && sameDate && overlappingTime;

    });
}

    // Find our HTML elements
    const workspaceContainer = document.getElementById("workspace-container");
    const capacityInput = document.getElementById("capacity-filter");
    const filterButton = document.getElementById("filter-button");

    const dateFilter = document.getElementById("date-filter");

    const startTimeFilter = document.getElementById("start-time-filter");

    const endTimeFilter = document.getElementById("end-time-filter");

    const availabilityFilter = document.getElementById("availability-filter");

    // Function to display workspaces
    function displayWorkspaces(workspaceList, selectedDate = "",
                           selectedStartTime = "", selectedEndTime = "") {

        // Clear existing workspace cards
        workspaceContainer.innerHTML = "";

        // Handle empty search results
        if (workspaceList.length === 0) {
            workspaceContainer.textContent =
                "No matching workspaces found. Try adjusting your filters.";
            return;
        }

        // Loop through the supplied workspaces
        workspaceList.forEach(function(workspace) {

            const card = document.createElement("div");

            card.className = "workspace-card";

            card.innerHTML = `
                <h2>${workspace.name}</h2>

                <p>Capacity: ${workspace.capacity}
                    ${workspace.capacity === 1 ? "person" : "people"}
                </p>

                <p class="workspace-status neutral">
                    Status: Select a date and time
                </p>

                <div class="booking-fields">

                    <div class="booking-group booking-date-group">
                        <label for="booking-date-${workspace.id}">
                            Booking Date
                        </label>

                        <input
                            type="date"
                            id="booking-date-${workspace.id}"
                            class="booking-date"
                        >
                    </div>

                    <div class="booking-group">
                        <label for="start-time-${workspace.id}">
                            Start Time
                        </label>

                        <input
                            type="time"
                            id="start-time-${workspace.id}"
                            class="start-time"
                        >
                    </div>

                    <div class="booking-group">
                        <label for="end-time-${workspace.id}">
                            End Time
                        </label>

                        <input
                            type="time"
                            id="end-time-${workspace.id}"
                            class="end-time"
                        >
                    </div>

                </div>

                <button class="book-button">
                    Book Now
                </button>
            `;

        workspaceContainer.appendChild(card);

        // Find the booking button inside this card
        const bookButton = card.querySelector(".book-button");
        // Find the booking date and time inputs
        const bookingDateInput = card.querySelector(".booking-date");
        const startTimeInput = card.querySelector(".start-time");
        const endTimeInput = card.querySelector(".end-time");

        // Populate booking fields using the selected filters
        bookingDateInput.value = selectedDate;
        startTimeInput.value = selectedStartTime;
        endTimeInput.value = selectedEndTime;

        // Find the workspace status element
        const statusElement = card.querySelector(".workspace-status");

        // Update workspace availability status
        function updateWorkspaceStatus() {

            const date = bookingDateInput.value;
            const start = startTimeInput.value;
            const end = endTimeInput.value;

           // Check for missing booking details
            if (!date || !start || !end) {
                statusElement.textContent =
                    "Status: Select a date and time";

                statusElement.className = "workspace-status neutral";

                return;
            }

            // Check for invalid time range
            if (end <= start) {
                statusElement.textContent =
                    "Status: Invalid time range";

                statusElement.className = "workspace-status invalid";

                return;
            }

            // Check that the reservation starts in the future
            const bookingStart = new Date(`${date}T${start}`);

            if (Number.isNaN(bookingStart.getTime()) ||
                bookingStart <= new Date()) {

                statusElement.textContent =
                    "Status: Select a future date and time";

                statusElement.className = "workspace-status invalid";

                return;
            }

            // Create a temporary booking for availability checking
            const requestedBooking = {
                workspaceId: workspace.id,
                date: date,
                startTime: start,
                endTime: end
            };

            // Check workspace availability
            if (hasBookingConflict(requestedBooking)) {
                statusElement.textContent = "Status: Unavailable";
                statusElement.className = "workspace-status unavailable";
            } else {
                statusElement.textContent = "Status: Available";
                statusElement.className = "workspace-status available";
            }
            }
        // Update availability when booking details change
        bookingDateInput.addEventListener("change", updateWorkspaceStatus);
        startTimeInput.addEventListener("change", updateWorkspaceStatus);
        endTimeInput.addEventListener("change", updateWorkspaceStatus);

        // Display the initial availability status
        updateWorkspaceStatus();

        // Handle workspace reservations
            bookButton.addEventListener("click", function() {

                // Read the selected booking details
        const bookingDate = bookingDateInput.value;
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;

        // Check that all fields have values
        if (!bookingDate || !startTime || !endTime) {
            alert("Please select a booking date, start time, and end time.");
            return;
        }

        // Check that the end time is after the start time
        if (endTime <= startTime) {
            alert("End time must be later than start time.");
            return;
        }

        // Check that the booking starts in the future
        const bookingStart = new Date(`${bookingDate}T${startTime}`);

        if (Number.isNaN(bookingStart.getTime()) || bookingStart <= new Date()) {
            alert("Please select a valid future booking date and start time.");
            return;
        }
        // Create a reservation object
        const newBooking = {
            id: crypto.randomUUID(),
            workspaceId: workspace.id,
            date: bookingDate,
            startTime: startTime,
            endTime: endTime
        };
          // Reject overlapping reservations
            if (hasBookingConflict(newBooking)) {
                alert("This workspace is already booked during the selected time.");
                return;
            }

            // Prevent overlapping reservations by the same user
            if (hasUserBookingConflict(newBooking)) {
                alert("You already have a reservation during the selected time.");
                return;
            }

            // Add the reservation to the bookings array
            bookings.push(newBooking);

            // Save the reservation to localStorage
            saveBookings();
            // Reapply filters after a successful reservation
            filterButton.click();

                alert("Workspace booked successfully!");

            });
        });
         }
        // Check for overlapping reservations by the current user
        function hasUserBookingConflict(newBooking) {

            return bookings.some(function(existingBooking) {

                const sameDate =
                    existingBooking.date === newBooking.date;

                const overlappingTime =
                    newBooking.startTime < existingBooking.endTime &&
                    newBooking.endTime > existingBooking.startTime;

                return sameDate && overlappingTime;

            });
        }
       

        // Only run this on the workspace browsing page
        if (workspaceContainer && capacityInput && filterButton) {

            // Display all workspaces initially
            displayWorkspaces(workspaces);

            // Listen for the Apply Filter button
            filterButton.addEventListener("click", function() {

                // Read the filter values
                const minimumCapacity = Number(capacityInput.value);
                const selectedDate = dateFilter.value;
                const selectedStartTime = startTimeFilter.value;
                const selectedEndTime = endTimeFilter.value;
                const availableOnly = availabilityFilter.checked;

                // Validate capacity
                if (!Number.isInteger(minimumCapacity) || minimumCapacity < 1) {
                    alert("Please enter a valid capacity of at least 1.");
                    return;
                }

                // Validate date and time when availability filtering is enabled
                if (availableOnly) {

                    if (!selectedDate || !selectedStartTime || !selectedEndTime) {
                        alert("Please select a date, start time, and end time.");
                        return;
                    }

                    if (selectedEndTime <= selectedStartTime) {
                        alert("End time must be later than start time.");
                        return;
                    }

                    const selectedStart = new Date(
                        `${selectedDate}T${selectedStartTime}`
                    );

                    if (Number.isNaN(selectedStart.getTime()) || selectedStart <= new Date()) {
                        alert("Please select a valid future date and start time.");
                        return;
                    }
                }

                // Filter workspaces
                const filteredWorkspaces = workspaces.filter(function(workspace) {

                    // Check capacity
                    if (workspace.capacity < minimumCapacity) {
                        return false;
                    }

                    // Check availability
                    if (availableOnly) {

                        const requestedBooking = {
                            workspaceId: workspace.id,
                            date: selectedDate,
                            startTime: selectedStartTime,
                            endTime: selectedEndTime
                        };

                        return !hasBookingConflict(requestedBooking);
                    }

                    return true;
                });

                // Display matching workspaces with selected booking details
                displayWorkspaces(
                    filteredWorkspaces,
                    selectedDate,
                    selectedStartTime,
                    selectedEndTime
                );

            });
        }
