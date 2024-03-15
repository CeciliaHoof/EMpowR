function Snapshot({ num, type }){
    
    return(
        <div>
            <h1>{type === "prescriptions" ? "💊" : "🩺" }</h1>
            <p>{`You have ${num} ${type} saved!`}</p>
        </div>
    )
    
}

export default Snapshot