import {FirebaseApplication, FirebaseDatabase} from "./FirebaseSetup";
import {ref as DatabaseRef, set as DatabaseSet, onValue} from "firebase/database";
import React from "react";
import {uid} from "uid";
import {AnimatePresence, motion} from "framer-motion";
import { MdDelete } from "react-icons/md";
import { MdEdit } from "react-icons/md";


function App() {


    const [bookTitle, setBookTitle] = React.useState("");
    const [bookDesc, setBookDesc] = React.useState("");
    const [bookContent, setBookContent] = React.useState("");
    const [values, setValues] = React.useState([]);

    const [show, setShow] = React.useState(false);
    const PushToDataBase = (e) => {
        e.preventDefault();
        const uuid = uid();
        DatabaseSet(DatabaseRef(FirebaseDatabase, `/${uuid}`), {
            bookTitle,
            bookDesc,
            bookContent
        }).then(setShow(!show));
    }
    const RenderDatabase = () => {
        onValue(DatabaseRef(FirebaseDatabase), snapshot => {
            const data = snapshot.val();
            if(data != null){
                Object.values(data).map((item) => {
                    setValues(beforeArr => [...beforeArr, item])
                })
            }
        })
    }


    React.useEffect(() => {
        if (show === true) {
            setTimeout(() => {
                setShow(!show)
            }, 2000)
        }
    }, [show])


    const [currentPage, setCurrentPage] = React.useState(0);
    return (
        <div className="App">
            {currentPage === 0 ? <React.Fragment>
                    <div style={AppStyles.CenterDiv}>
                        <h1 style={AppStyles.HeadingStyle}>Book Management System</h1>
                    </div>
                    <div style={AppStyles.CenterDiv}>
                        <form onSubmit={PushToDataBase} style={AppStyles.FormStyles}>
                            <label style={AppStyles.FormLabel}>Book Title:</label>
                            <input onChange={e => setBookTitle(e.target.value)} style={AppStyles.FormInput}
                                   placeholder={'Enter here: '} type={'text'}/>
                            <label style={AppStyles.FormLabel}>Book Description: </label>
                            <input onChange={e => setBookDesc(e.target.value)} style={AppStyles.FormInput}
                                   placeholder={'Enter here: '} type={'text'}/>
                            <label style={AppStyles.FormLabel}>Book Content: </label>
                            <textarea onChange={e => setBookContent(e.target.value)} placeholder={'Enter here: '} rows={10}
                                      style={AppStyles.FormTextArea}></textarea>
                            <button style={AppStyles.SubmitButton}>Submit</button>
                        </form>
                    </div>

                    <AnimatePresence>
                        {show && <motion.div animate={{height: "auto"}} initial={{height: 0}} exit={{height: 0}} style={{
                            backgroundColor: "#9ADE7B",
                            transition: "all 500ms ease-in-out",
                            color: "white",
                            zIndex: 1000,
                            position: "fixed",
                            bottom: "0.5rem",
                            overflow: "hidden",
                            fontSize: "3rem",
                            fontWeight: "bold",
                            left: "50%",
                            transform: "translate(-50%)",
                            width: "70vw",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "1rem",
                            padding: "0.5rem",
                        }}>
                            Successful
                        </motion.div>}
                    </AnimatePresence>
                </React.Fragment> :
                <React.Fragment>
                    <div style={AppStyles.CenterDivRender} >
                        <button onClick={() => RenderDatabase()} style={AppStyles.RenderButton}>Render Database</button>
                        {values.map((item, index) => {
                            return <div style={{width: "100%", backgroundColor: "#F4F27E", border: "7px solid black", borderRadius: "2rem", padding: "2rem"}}>
                                <h1>{item.bookTitle}</h1>
                                <p style={{width: "100%", textAlign: "justify"}}>{item.bookDesc}</p>
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <button><MdDelete /></button>
                                    <button><MdEdit /></button>
                                </div>

                            </div>
                        })}
                    </div>
                </React.Fragment>
            }

            <Navbar currentPageIndex={currentPage} setCurrentPageIndex={setCurrentPage}/>
        </div>
    );
}


const Navbar = ({currentPageIndex, setCurrentPageIndex}) => {
    const Options = [{Name: "Home", toPage: 0}, {Name: "Render", toPage: 1}];
    return <div style={{
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        gap: "1.5rem",
        backgroundColor: "white",
        width: "100vw",
        padding: "1.5rem",
        boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px"
    }}>
        {Options.map((item, index) => {
            return <h1 style={{
                backgroundColor: currentPageIndex === index ? "#F4CE14" : "grey",
                padding: "0.5rem",
                borderRadius: "1rem",
                border: "5px solid black",
                borderBottom: "8px solid black",
                borderRight: "8px solid black",
                fontSize: "1.3rem",
                cursor: "default",
            }} onClick={() => setCurrentPageIndex(item.toPage)}>{item.Name}</h1>
        })}

    </div>
}


export default App;
const AppStyles = {
    HeadingStyle: {
        fontSize: "4rem",
        textAlign: "center",
        padding: "1rem",
        border: "10px solid black",
        borderBottom: "20px solid black",
        marginBlock: "2rem",
        borderRight: "20px solid black",
        borderRadius: "2rem",
        display: "inline-block",
        backgroundColor: "#F4CE14",
        marginTop: "10rem",
    },
    KeyStyle: {
        backgroundColor: "#F4F27E",
        border: "5px solid black",
        borderRadius: "2rem",
    },
    CenterDivRender: {
        width: "70vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginInline: "auto",
    },
    FormLabel: {
        fontSize: "2rem",
        marginBlock: "1rem",
    },
    CenterDiv: {
        width: "90%",
        marginInline: "auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    FormStyles: {
        width: "68%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    FormInput: {
        fontSize: "1.5rem",
        padding: "1rem",
        borderRadius: "1rem",
    },
    FormTextArea: {
        fontSize: "1.5rem",
        padding: "1rem",
        borderRadius: "1rem",
        maxWidth: "100%",
        minWidth: "100%",
        minHeight: "20rem",
        maxHeight: "40rem",
    },
    SubmitButton: {
        borderRadius: "2rem",
        padding: "1rem",
        marginBlock: "1.5rem",
        fontSize: "2rem",
        border: "8px solid black",
        borderBottom: "16px solid black",
        borderRight: "16px solid black",
        fontWeight: "bold",
        backgroundColor: "#F4CE14",
    },
    RenderButton: {
        borderRadius: "2rem",
        padding: "1rem",
        marginBlock: "10rem",
        fontSize: "2rem",
        width: "100%",
        border: "8px solid black",
        borderBottom: "16px solid black",
        borderRight: "16px solid black",
        fontWeight: "bold",
        backgroundColor: "#F4CE14",
    }

}