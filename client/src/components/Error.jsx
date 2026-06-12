/**
 * @file Error.jsx
 * @description Global error display component.
 * Renders HTTP status codes and error messages when exceptions occur.
 */
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
