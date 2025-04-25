import {useLoading} from "./LoadingContext.tsx";

const Spinner = () => {
    const { loading } = useLoading();

    if (!loading) return null; // Don't render anything if not loading

    return (
        <div className="spinner-overlay">
            <div className="spinner-circle"></div>
        </div>
    );
};

export default Spinner;
