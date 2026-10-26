// Workspace data

const workspaces = [
    {
        id: 1,
        name: "Executive Meeting Room",
        capacity: 8,
        available: true,
        bookedByCurrentUser: false

    },

    {
        id: 2,
        name: "Private Office",
        capacity: 2,
        available: true,
        bookedByCurrentUser: false

    },

    {
        id: 3,
        name: "Conference Room",
        capacity: 12,
        available: false,
        bookedByCurrentUser: false

    },

    {
        id: 4,
        name: "Individual Desk",
        capacity: 1,
        available: true,
        bookedByCurrentUser: false

    }
];

// Retrieve previously saved workspace data
const savedWorkspaces = localStorage.getItem("nookWorkspaces");

// Restore saved availability
if (savedWorkspaces !== null) {

    const storedWorkspaces = JSON.parse(savedWorkspaces);

    workspaces.forEach(function(workspace) {

        const savedWorkspace = storedWorkspaces.find(function(saved) {
            return saved.id === workspace.id;
        });

        if (savedWorkspace) {
            workspace.available = savedWorkspace.available;

            if (typeof savedWorkspace.bookedByCurrentUser === "boolean") {
                workspace.bookedByCurrentUser =
                    savedWorkspace.bookedByCurrentUser;
            }
        }

    });
}

// Find our HTML elements
const workspaceContainer = document.getElementById("workspace-container");
const capacityInput = document.getElementById("capacity-filter");
const filterButton = document.getElementById("filter-button");

// Function to display workspaces
function displayWorkspaces(workspaceList) {

    // Clear existing workspace cards
    workspaceContainer.innerHTML = "";

    // Loop through the supplied workspaces
    workspaceList.forEach(function(workspace) {

        const card = document.createElement("div");

        card.className = "workspace-card";

        let buttonText;
        let buttonDisabled = false;

        if (workspace.available) {
            buttonText = "Book Now";
        } else if (workspace.bookedByCurrentUser) {
            buttonText = "Cancel Booking";
        } else {
            buttonText = "Unavailable";
            buttonDisabled = true;
        }

        card.innerHTML = `
            <h2>${workspace.name}</h2>
            <p>Capacity: ${workspace.capacity} people</p>
            <p>Status: ${workspace.available ? "Available" : "Booked"}</p>

            <button class="book-button" ${buttonDisabled ? "disabled" : ""}>
                ${buttonText}
            </button>
        `;

        workspaceContainer.appendChild(card);

        // Find the booking button inside this card
const bookButton = card.querySelector(".book-button");

// Only allow booking available workspaces
if (workspace.available) {

    bookButton.addEventListener("click", function() {

        // Update workspace availability
        workspace.available = false;
        //Record who made the booking
        workspace.bookedByCurrentUser = true;

        // Save updated workspace availability in localStorage
        localStorage.setItem("nookWorkspaces", JSON.stringify(workspaces));

        // Refresh displayed workspaces
        displayWorkspaces(workspaceList);

        alert("Workspace booked successfully!");

    });
}   else if (workspace.bookedByCurrentUser) {

    bookButton.addEventListener("click", function() {

        // Make the workspace available again
        workspace.available = true;

        // Remove booking ownership
        workspace.bookedByCurrentUser = false;

        // Save updated workspace data
        localStorage.setItem("nookWorkspaces", JSON.stringify(workspaces));

        // Refresh the workspace cards
        displayWorkspaces(workspaceList);

        alert("Booking cancelled successfully!");

    });
}

    });
}

// Only run this on the workspace browsing page
if (workspaceContainer && capacityInput && filterButton) {

    // Display all workspaces initially
    displayWorkspaces(workspaces);

    // Listen for the Apply Filter button
    filterButton.addEventListener("click", function() {

        // Read the minimum capacity entered
        const minimumCapacity = Number(capacityInput.value);

        // Validate the input
        if (!Number.isInteger(minimumCapacity) || minimumCapacity < 1) {
            alert("Please enter a valid capacity of at least 1.");
            return;
        }

        // Filter workspaces
        const filteredWorkspaces = workspaces.filter(function(workspace) {

            return workspace.capacity >= minimumCapacity;

        });

        // Display matching workspaces
        displayWorkspaces(filteredWorkspaces);

    });
}
