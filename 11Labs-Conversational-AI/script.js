import { Conversation } from '@11labs/client';

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const connectionStatus = document.getElementById('connectionStatus');
    const agentStatus = document.getElementById('agentStatus');

    let conversation;

    async function startConversation() {
        try {
            // Request microphone permission
            await navigator.mediaDevices.getUserMedia({ audio: true });

            // Ensure the AGENT_ID is correctly set
            const agentId = "0Eq1FVRMkD8CLdqpQY6y";
            
            // Start the conversation
            conversation = await Conversation.startSession({
                agentId,
                onConnect: () => {
                    connectionStatus.textContent = 'Connected';
                    startButton.disabled = true;
                    stopButton.disabled = false;
                },
                onDisconnect: () => {
                    connectionStatus.textContent = 'Disconnected';
                    startButton.disabled = false;
                    stopButton.disabled = true;
                },
                onError: (error) => {
                    console.error('Error:', error);
                    alert('An error occurred while starting the conversation.');
                },
                onModeChange: (mode) => {
                    agentStatus.textContent = mode.mode === 'speaking' ? 'Speaking' : 'Listening';
                },
            });
        } catch (error) {
            console.error('Failed to start conversation:', error);
            alert('Failed to access microphone or start the conversation.');
        }
    }

    async function stopConversation() {
        if (conversation) {
            try {
                await conversation.endSession();
                conversation = null;
            } catch (error) {
                console.error('Failed to stop conversation:', error);
                alert('An error occurred while stopping the conversation.');
            }
        }
    }

    startButton.addEventListener('click', startConversation);
    stopButton.addEventListener('click', stopConversation);
});
