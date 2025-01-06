let fileManagementData = {};

fetch('data.json')
    .then(response => response.json())
    .then(data => {
        fileManagementData = data;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

function getElizaResponse(input) {
    input = input.toLowerCase();
    for (let topic of Object.keys(fileManagementData)) {
        if (input.includes(topic.toLowerCase())) {
            return getTopicDetails(fileManagementData[topic], input);
        }
        if (Array.isArray(fileManagementData[topic])) {
            for (let subtopic of fileManagementData[topic]) {
                if (subtopic.method && input.includes(subtopic.method.toLowerCase())) {
                    return formatSubtopicDetails(subtopic);
                }
                if (subtopic.algorithm && input.includes(subtopic.algorithm.toLowerCase())) {
                    return formatSubtopicDetails(subtopic);
                }
            }
        }
    }
    return "I'm sorry, I don't have information on that. Could you ask something else related to file management?";
}

function getTopicDetails(topic, input) {
    let response = `<strong>${topic.topic}</strong>: `;
    topic.subtopics.forEach(subtopic => {
        if (input.includes(subtopic.method?.toLowerCase()) || input.includes(subtopic.algorithm?.toLowerCase())) {
            response += `<br><strong>${subtopic.method || subtopic.algorithm}</strong>: ${subtopic.description || ''}`;
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
    let response = `<strong>${subtopic.method || subtopic.algorithm}</strong>: ${subtopic.description || ''}`;
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
    chatOutput.scrollTop = chatOutput.scrollHeight; 
}
