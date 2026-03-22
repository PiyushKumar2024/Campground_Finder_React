const Error = ({ err }) => {
    return (
        <>
            <h1>{err.status}</h1>
            <h2>{err.message}</h2>
            <p>{err.stack}</p>
        </>
    )
}

export default Error;
