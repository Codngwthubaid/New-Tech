const fileManagementData = [
    {
        topic: "File Allocation Methods",
        subtopics: [
            {
                method: "Contiguous Allocation",
                description: "Files occupy a contiguous set of blocks on the disk.",
                advantages: [
                    "Supports sequential and direct access.",
                    "Fast as the file blocks are contiguous."
                ],
                disadvantages: [
                    "Prone to internal and external fragmentation.",
                    "Difficult to increase file size due to dependency on contiguous free space."
                ]
            },
            {
                method: "Linked Allocation",
                description: "Files are stored as a linked list of disk blocks, which need not be contiguous.",
                advantages: [
                    "Flexible in terms of file size.",
                    "No external fragmentation."
                ],
                disadvantages: [
                    "Slower access due to sequential traversal.",
                    "Does not support direct access.",
                    "Requires extra memory for pointers."
                ]
            },
            {
                method: "Indexed Allocation",
                description: "A special index block contains pointers to all blocks occupied by the file.",
                advantages: [
                    "Supports direct access.",
                    "Eliminates external fragmentation."
                ],
                disadvantages: [
                    "Higher pointer overhead.",
                    "Inefficient for small files due to index block storage."
                ]
            }
        ]
    },
    {
        topic: "Hard Disk Drive (HDD)",
        subtopics: [
            {
                title: "Structure",
                description: "Consists of rotating platters coated with a magnetic layer. Data is read and written using read/write heads. Organized into tracks and sectors."
            },
            {
                title: "Performance Metrics",
                details: [
                    "Seek Time: Time to move the read/write head to the desired track.",
                    "Rotational Latency: Time for the desired sector to come under the head.",
                    "Data Transfer Time: Time to transfer data.",
                    "Access Time: Sum of seek time, rotational latency, and transfer time."
                ]
            },
            {
                title: "Storage Capacities",
                description: "Range from 16 GB to 20 TB, catering to different user needs."
            }
        ]
    },
    {
        topic: "Disk Scheduling Algorithms",
        subtopics: [
            {
                algorithm: "FCFS (First Come First Serve)",
                description: "Processes requests in the order they arrive.",
                advantages: ["Simple and fair."],
                disadvantages: ["May lead to long wait times and high seek times."]
            },
            {
                algorithm: "SSTF (Shortest Seek Time First)",
                description: "Processes the nearest request next.",
                advantages: ["Reduces average response time."],
                disadvantages: ["May cause starvation of distant requests."]
            },
            {
                algorithm: "SCAN (Elevator Algorithm)",
                description: "The head moves in one direction servicing requests, then reverses.",
                advantages: ["High throughput and low variance in response time."],
                disadvantages: ["Longer wait times for requests just serviced."]
            },
            {
                algorithm: "C-SCAN (Circular SCAN)",
                description: "Similar to SCAN but the head returns to the start without servicing requests during the return trip.",
                advantages: ["Provides more uniform wait times."],
                disadvantages: ["May involve unnecessary movements."]
            },
            {
                algorithm: "LOOK and C-LOOK",
                description: "LOOK: Similar to SCAN but stops at the last request before reversing direction. C-LOOK: Similar to C-SCAN but only goes to the last request before starting over.",
                advantages: ["Avoids unnecessary traversal to disk edges."]
            }
        ]
    }
];

function getElizaResponse(input) {
    input = input.toLowerCase();
    for (let topic of fileManagementData) {
        if (input.includes(topic.topic.toLowerCase())) {
            return getTopicDetails(topic, input);
        }
        for (let subtopic of topic.subtopics) {
            if (subtopic.method && input.includes(subtopic.method.toLowerCase())) {
                return formatSubtopicDetails(subtopic);
            }
            if (subtopic.algorithm && input.includes(subtopic.algorithm.toLowerCase())) {
                return formatSubtopicDetails(subtopic);
            }
            if (subtopic.title && input.includes(subtopic.title.toLowerCase())) {
                return formatSubtopicDetails(subtopic);
            }
        }
    }
    return "I'm sorry, I don't have information on that. Could you ask something else related to file management?";
}

function getTopicDetails(topic, input) {
    let response = `<strong>${topic.topic}</strong>: `;
    topic.subtopics.forEach(subtopic => {
        if (input.includes(subtopic.method?.toLowerCase()) || input.includes(subtopic.algorithm?.toLowerCase()) || input.includes(subtopic.title?.toLowerCase())) {
            response += `<br><strong>${subtopic.method || subtopic.algorithm || subtopic.title}</strong>: ${subtopic.description || ''}`;
            if (subtopic.advantages) {
                response += `<br><strong>Advantages:</strong> ${subtopic.advantages.join(", ")}`;
            }
            if (subtopic.disadvantages) {
                response += `<br><strong>Disadvantages:</strong> ${subtopic.disadvantages.join(", ")}`;
            }
        }
    });
    return response;
}

function formatSubtopicDetails(subtopic) {
    let response = `<strong>${subtopic.method || subtopic.algorithm || subtopic.title}</strong>: ${subtopic.description || ''}`;
    if (subtopic.advantages) {
        response += `<br><strong>Advantages:</strong> ${subtopic.advantages.join(", ")}`;
    }
    if (subtopic.disadvantages) {
        response += `<br><strong>Disadvantages:</strong> ${subtopic.disadvantages.join(", ")}`;
    }
    return response;
}

function sendMessage() {
    const userInput = document.getElementById('userInput').value;
    if (userInput.trim() === "") return;
    
    const chatOutput = document.getElementById('chatOutput');
    chatOutput.innerHTML += `<p><strong>User:</strong> ${userInput}</p>`;
    
    const elizaResponse = getElizaResponse(userInput);
    chatOutput.innerHTML += `<p><strong>Eliza:</strong> ${elizaResponse}</p>`;
    
    document.getElementById('userInput').value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight; // Scroll to the bottom
}