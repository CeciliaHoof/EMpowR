import { useRouteError } from "react-router-dom";

function ErrorPage() {
    const error = useRouteError();
    console.error(error)

    return(
        <>
            <h1>Whoops! Something went wrong!</h1>
            <p>Try navigating to one of our other pages to get back on track.</p>
        </>
    )
}

export default ErrorPage;