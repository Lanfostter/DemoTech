import './App.css'
import {ToastContainer} from "react-toastify";
import AppRoutes from "./routes/routes.tsx";
function App() {
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000} // tự đóng sau 3s
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <AppRoutes/>
        </>
    )
}

export default App
