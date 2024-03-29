import OpenAI from 'openai';
import { Assistant } from 'openai/resources/beta/assistants/assistants';
import { Thread } from 'openai/resources/beta/threads/threads';

export default class OpenAIService {
    private thread: Thread | undefined = undefined;
    private openai: OpenAI | undefined = undefined;
    private assistant: Assistant | undefined = undefined;
    public isInitialized: boolean = false;

    public async init() {
        if (!this.isInitialized) {
            this.openai = new OpenAI({
                apiKey: process.env.OPENAI_KEY,
                organization: process.env.OPENAI_ORG,
            });

            this.thread = await this.openai.beta.threads.create();

            this.assistant = await this.openai.beta.assistants.create({
                name: 'IT4YOU_SIX_ASSISTANT',
                model: 'gpt-3.5-turbo-0125',
                description: 'Assistant that provides information about Apprenticeship in IT.',
                instructions:
                    'Du bist ein Assistent, der Informationen über die Ausbildung zum Applikations- Plattformentwickler in der Schweiz liefert. ' +
                    'Du arbeitest für die Schweizer Börse SIX. Dort gibt es auch andere Partnerfirmen. ' +
                    'Die Leute werden dir Fragen rund um dieses Thema stellen. Seien Sie freundlich und klar und leicht verständlich, denn Sie haben auch ein jüngeres Publikum.',
                file_ids: this.get_file_ids(),
                tools: [{ type: 'retrieval' }],
            });
            this.isInitialized = true;
        }
    }

    private get_file_ids() {
        const fileIds = process.env.FILE_IDS;
        const fileIdsArray: string[] = fileIds ? fileIds.split(',') : [];

        return fileIdsArray;
    }

    public async chat(message: string): Promise<string> {
        if (!this.openai || !this.thread || !this.assistant) {
            throw new Error('OpenAI service is not initialized properly.');
        }

        // Send the user message to the thread
        await this.openai.beta.threads.messages.create(this.thread.id, {
            role: 'user',
            content: message,
        });

        // Create a new "run" to process the message with the assistant
        const run = await this.openai.beta.threads.runs.create(this.thread.id, {
            assistant_id: this.assistant.id,
        });

        // Retrieve the "run" status and wait for it to be completed
        let runStatus = await this.openai.beta.threads.runs.retrieve(this.thread.id, run.id);
        while (runStatus.status !== 'completed') {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Poll every second
            runStatus = await this.openai.beta.threads.runs.retrieve(this.thread.id, run.id);
        }

        // Get the last assistant message from the messages array
        const messages = await this.openai.beta.threads.messages.list(this.thread.id);

        // Find the last message from the assistant for the current run
        const lastMessageForRun: any = messages.data
            .filter((msg) => msg.run_id === run.id && msg.role === 'assistant')
            .pop();

        if (lastMessageForRun) {
            // Return the text from the last assistant message
            return lastMessageForRun.content[0].text.value;
        } else {
            throw new Error('No response from the assistant.');
        }
    }
}
