import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function Dashboard() {
    // @ts-ignore
    const customer = useSelector(state => state.customer);
    // @ts-ignore
    const loggedIn = useSelector(state => state.loggedIn);
    
    if (!loggedIn) {
        return (<Navigate to='/' replace={true}  />);
    }
    return (
        <div>
            <h1>Dashboard Page</h1>
            <div>{customer.first_name}</div>
        </div>
    );
}


export default Dashboard;