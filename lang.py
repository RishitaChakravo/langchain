import streamlit as st
from langchain_groq import ChatGroq
from constant import GROQ_API_KEY

from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import DocArrayInMemorySearch
from langchain_classic.indexes.vectorstore import VectorstoreIndexCreator
import tempfile
import os

chat = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=GROQ_API_KEY
    )

@st.cache_resource
def load_embeddings():
    return HuggingFaceEmbeddings()

uploaded_file = st.file_uploader("Upload your file", type=["pdf"])
if uploaded_file:
    st.session_state.clear()

query = st.text_input(label="Write your query: ")
def submit_info():
    if uploaded_file is None or query is None:
        st.write("Submit the file and your question")
    else:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(uploaded_file.getbuffer())
            tmp_path = tmp_file.name
            loader = PyPDFLoader(tmp_path)
        doc = loader.load()

        embeddings = load_embeddings()

        index = VectorstoreIndexCreator(
            vectorstore_cls=DocArrayInMemorySearch,
            embedding=embeddings
        ).from_documents(doc)

        response = index.query(query, llm=chat)
        st.write(response)

        os.unlink(tmp_path)

st.button(label="Submit", on_click=submit_info)

if "response" in st.session_state:
    st.write(st.session_state.response)
    


