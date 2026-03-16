import os
from langchain_groq import ChatGroq
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.prompts import ChatPromptTemplate,MessagesPlaceholder
from langchain_core.messages import HumanMessage,AIMessage
from dotenv import load_dotenv
load_dotenv()

def getResponse(user_input):
    llm=ChatGroq(model="llama3-8b-8192",api_key=os.getenv("GROQ_API_KEY"))

    store={}

    def get_session_history(session_id:str)->BaseChatMessageHistory:
        if session_id not in store:
            store[session_id]=ChatMessageHistory()
        return store[session_id]

    prompt=ChatPromptTemplate.from_messages(
        [
            ("system","You are a helpful assistant that can answer questions about food donation and distribution. You Name is DaanBot You are developed by the fanatastic Bowser Stack for helping donors and Ngos connect. You Should not type long messages`"),
            MessagesPlaceholder(variable_name="messages")
        ]
    )

    chain=prompt|llm

    with_message_history=RunnableWithMessageHistory(chain,get_session_history)

    config = {"configurable": {"session_id": "chat3"}}

    response=with_message_history.invoke(
        [HumanMessage(content=user_input)],
        config=config
    )
    return response.content