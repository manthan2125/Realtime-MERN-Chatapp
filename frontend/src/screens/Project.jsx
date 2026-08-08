import React,{ useState, useEffect, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom';
import axios from "../config/axios.js"
import { initializeSocket, receiveMessage, sendMessage } from "../config/socket.js"
import { UserContext } from '../context/user.context.jsx';
import Markdown from "markdown-to-jsx";


const Project = () => {

    const location = useLocation();
    // console.log(location.state);

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [ selectedUserId, setSelectedUserId ] = useState(new Set())  // A Set is a JavaScript object that stores unique values only.
    const [project, setProject] = useState(location.state.project)   // location.state.project -> will hold clicked project in on HOME page in the form of object 
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext);
    const messageBox = React.createRef();
    
    const [users, setUsers] = useState([])  // users array is an array of objects of all users except logged in user
    const [messages, setMessages] = useState([])

    
    function SyntaxHighlightedCode(props) {
        const ref = useRef(null)

        React.useEffect(() => {
            if (ref.current && props.className?.includes('lang-') && window.hljs) {
                window.hljs.highlightElement(ref.current)

                // hljs won't reprocess the element unless this attribute is removed
                ref.current.removeAttribute('data-highlighted')
            }
        }, [ props.className, props.children ])

        return <code {...props} ref={ref} />
    }


    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {                       // React gives you the latest state in prevSelectedUserId
            const newSelectedUserId = new Set(prevSelectedUserId);      // This creates a new Set containing the same values.
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }

    function addCollaborators() {

        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            // console.log(res.data)
            setIsModalOpen(false)
        }).catch(err => {
            console.log(err)
        })
    }

    function send() {
        sendMessage("project-message", {
            message,
            sender: user
        })

        setMessages(prevMessages => [ ...prevMessages, { sender: user, message } ]) // Update messages state
        setMessage("");
    }

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    // function appendIncomingMessage(messageObject){

    //     const messageBox = document.querySelector(".message-box");

    //     const message = document.createElement("div");
    //     message.classList.add("message", "max-w-56", "flex", "flex-col", "p-2","bg-slate-50","w-fit","rounded-md");

    //     if(messageObject.sender._id === "ai"){

    //         const markdown = (<Markdown>{messageObject.message}</Markdown>)
    //         message.innerHTML = `
    //         <small className='opacity-65 test-xs'>${messageObject.sender.email}</small>
    //         <p className='text-sm'>${markdown}</p>
    //         `
    //     } else{
    //         message.innerHTML = `
    //             <small className='opacity-65 test-xs'>${messageObject.sender.email}</small>
    //             <p className='text-sm'>${messageObject.message}</p>
    //         `
    //     }
    //     messageBox.appendChild(message);
    //     scrollToBottom()
    // } 


    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-950 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            // code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>
        )
    }

    useEffect(() => {

        initializeSocket(project._id);

        receiveMessage("project-message", data => {
            setMessages(prevMessages => [ ...prevMessages, data])    // Update messages state
        });



        axios.get(`/projects/get-project/${location.state.project._id}`)
        .then(res => {
            // console.log("project with usser data", res.data.project);    // this will get that specific project with populated user
            setProject(res.data.project)
        })

        //  iss res.data.users ke andar wo sare user honge except logged in user
        axios.get("/users/all").then( res => {
            setUsers(res.data.users) 
        }).catch(err => {
            console.log(err);
        })
    }, []);

    
    // function appendOutgoingMessage(message){

    //     const messageBox = document.querySelector(".message-box");

    //     const newMessage = document.createElement("div");
    //     newMessage.classList.add("ml-auto", "message", "max-w-56","flex", "flex-col", "p-2", "bg-slate-50","w-fit", "rounded-md");
    //     newMessage.innerHTML = `
    //                 <small className='opacity-65 test-xs'>${user.email}</small>
    //                 <p className='text-sm'>${message}</p>
    //             `
    //     messageBox.appendChild(newMessage);
    //     scrollToBottom()
    // }

    
  return (
    <main
    className='h-screen w-screen flex'
    >
        <section className='left h-screen min-w-96 bg-slate-300 flex flex-col relative' >
            <header
            className='flex justify-between items-center p-2 px-4 min-w-96 bg-slate-100 absolute top-0 z-10'>
                <button
                onClick= {() =>  setIsModalOpen(true)}
                className='flex gap-2 cursor-pointer'
                >
                    <i className="ri-add-fill mr-1"></i>
                    <p>Add Colaborator</p>
                </button>

                <button 
                onClick={() => {setIsSidePanelOpen(!isSidePanelOpen)}}
                className='p-2 cursor-pointer'
                >
                    <i className="ri-group-fill"></i>
                </button>
            </header>

            <div className="conversation-area flex flex-col grow p-2 pt-16 relative h-screen" >
                <div 
                ref={messageBox}
                className="message-box flex flex-col grow gap-1 pb-2 overflow-auto max-h-full scrollbar-hide">
                    {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}>
                                <small className='opacity-65 text-xs'>{msg.sender.email}</small>
                                <div className='text-sm'>
                                    {msg.sender._id === 'ai' ? 
                                    <div className='overflow-auto bg-slate-950 text-white p-2 rounded-sm'>
                                        <Markdown>{msg.message}</Markdown> 
                                    </div>
                                    : <p>{msg.message}</p>}
                                </div>
                            </div>
                    ))}
                </div>
                
                <div className="input-field w-full flex bg-slate-100 ">
                    <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className='p-2 px-4 border-none outline-none grow  min-w-0'
                    type="text" placeholder='Enter message' />
                    <button 
                    onClick={send}
                    className='px-5 cursor-pointer bg-slate-950 text-white'><i className="ri-send-plane-fill"></i></button>
                </div>
            </div>  

            <div className= {`sidePanel flex flex-col gap-2 min-w-96 h-full bg-slate-50 absolute transition-all ${ isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                <header className='flex justify-between items-center px-4 p-2 bg-slate-300'>
                    <h1 className='font-semibold text-lg'>Collaborators</h1>
                    <button
                    onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                    className='p-2 cursor-pointer'
                    >
                        <i className="ri-close-fill"></i>
                    </button>
                </header>

                <div className="users flex flex-col gap-">
                    { project.users && project.users.map(user => {
                        return (
                            <div key={user._id} className="user p-2 flex gap-2 items-center cursor-pointer hover:bg-slate-200">
                                <div
                                className='aspect-square rounded-full w-fit h-fit p-5 text-white bg-slate-600 flex items-center justify-center'>
                                    <i className="ri-user-fill absolute"></i>
                                </div>
                                <h1 className='text-lg'>{user.email}</h1>
                            </div>
                        )
                    })}
                </div>
            </div>

        </section>
        

        {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill"></i>
                            </button>
                        </header>

                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map(user => (                                                        // ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-slate-200' : ""}
                                <div key={user._id} className={`user cursor-pointer hover:bg-slate-200  ${ selectedUserId.has(user._id) ? 'bg-slate-200' : ""}  p-2 flex gap-2 items-center`} onClick={() => handleUserClick(user._id)}>
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-lg'>{user.email}</h1>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={addCollaborators}
                            className='absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md'>
                            Add Collaborators
                        </button>
                    </div>
                </div>
            )}


    </main>
  )
}

export default Project
